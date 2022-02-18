import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion, DataType } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";

import cors from 'koa-cors';
import koaBody from 'koa-bodyparser';
const axios = require('axios');
const baseURL = "https://clients.adserea.com/api/shopify/";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(cors());

  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope} = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;
        ACTIVE_SHOPIFY_SHOPS["ShopOrigin"] = shop;
        ACTIVE_SHOPIFY_SHOPS["AccessToken"] = accessToken;
        ACTIVE_SHOPIFY_SHOPS["AdminId"] = ctx.state.shopify.id;

        console.log("ACTIVE_SHOPIFY_SHOPS", ACTIVE_SHOPIFY_SHOPS)

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }
        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });




  /* Create custome code */

  router.post("/setuser", async (ctx) => {
    //let AdminId = 'dr__5fbbac868397bc31e7fd';
    let CIAccessToken = ACTIVE_SHOPIFY_SHOPS["AccessToken"];
    let CIShopOrigin = ACTIVE_SHOPIFY_SHOPS["ShopOrigin"];
    let AdminId = ACTIVE_SHOPIFY_SHOPS["iAdminIdd"];
    var config = {
      method: "post",
      url: baseURL+'customers/'+AdminId,
      headers: {"Content-Type": "application/json"},
      data: {
        "shopify_url": CIShopOrigin+'/',
        "access_token":CIAccessToken
      },
    };
    let response = { error: true};
    const UserResponse = await axios(config)
      .then(async function (response) {
        ctx.body = response.data;
        ctx.status = 200;
      }).catch(function (error) {
        if(error.response.data.status)
        {
          ctx.body = error.response.data;
          ctx.status = 200;
        }
      });
  });

  /**
 * Create Product in shopify
 */
     router.post("/api/create-product", koaBody(), async (ctx) => {
      if (!ctx.request.body) {
        ctx.body = [{ 'message': 'no items in the cart' }];
      }
      let ShopOrigin = ACTIVE_SHOPIFY_SHOPS["ShopOrigin"];
      let AccessToken = ACTIVE_SHOPIFY_SHOPS["AccessToken"];
     // let AdminId = ACTIVE_SHOPIFY_SHOPS["iAdminIdd"];
       let AdminId = 'dr__5fbbac868397bc31e7fd';

       console.log("shop url: ", ShopOrigin);

      var config = {
        method: "get",
        url: baseURL+'customers/stores/'+AdminId,
        headers: {"Content-Type": "application/json" } 
      };
      let response = { error: true };
      const UserResponse = await axios(config)
        .then(async function (response) {

          console.log("Getting shop feach api: ", response.data)

          let obj = response.data.find(o => o.shopify_url === ShopOrigin+'/');
          console.log("Getting shop detail on client side data: ",obj);

          if(obj!=undefined)
          { 
                const client = new Shopify.Clients.Rest(process.env.SHOP, AccessToken);
                const orderdata = await client.post({
                path: 'products',
                data: ctx.request.body,
                type: DataType.JSON
                })
                .then(data => {
                  ctx.body = [{ 'status':true, 'message': 'Product create successfully!' }];
                  ctx.status = 200;
                }).catch(function (error) {
                  ctx.body = [{ 'status':false, 'message': 'wrong parameters','data': error }];
               ctx.status = 200;
                  return error;
                })
          }
          else{ 
               ctx.body = [{ 'status':false, 'message': 'Store not register to client side.' }];
               ctx.status = 200;
          }
        }).catch(function (error) {
          if(error.response.data.status)
          {
            ctx.body = error.response.data;
            ctx.status = 200;
          }
        });
       
     
      
    });

  /* Create product code */

  /* demo */

  router.post("/uploadproduct", koaBody(), async (ctx) => {
    var random_name = require('node-random-name');
    let ShopOrigin = ACTIVE_SHOPIFY_SHOPS["ShopOrigin"];
    let AccessToken = ACTIVE_SHOPIFY_SHOPS["AccessToken"];
    let product_st = random_name();
    let product_price = between(10, 2000)
    if (!ctx.request.body) {
      ctx.body = [{ 'message': 'no items in the cart' }];
    }
    if (ShopOrigin || AccessToken) {
      const client = new Shopify.Clients.Rest(process.env.SHOP, AccessToken);
      const data = await client.post({
        path: 'products',
        data: {"product":{
          "title":product_st,
          "body_html":"\u003cstrong\u003eGood snowboard!\u003c\/strong\u003e",
          "vendor":"Burton",
          "product_type":product_st,
          "variants":[{
            "price": product_price,
            "sku": "TIS"+product_st,
             "inventory_quantity": 100,
            "option1":"Blue",
            "option2":"155"
          },
            {
              "price": product_price,
              "sku": "TIS"+product_st,
              "option1":"Black",
              "option2":"159"
            }],
            "options":[{
              "name":"Color",
              "values":[
                "Blue","Black"
              ]},{
                "name":"Size",
                "values":["155","159"
              ]}
            ]
          }
        },
        type: DataType.JSON
      })
        .then(data => {
          return data;
        });
      ctx.body = "Product "+product_st+" upload successfully!";
      ctx.status = 200;
    } else {
      ctx.body = [{ 'message': 'You are not authorised!' }];
      ctx.status = 200;
    }
    
  });



  function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
  }



  const corsOpts = {
    origin: '*',

    methods: [
      'GET',
      'POST',
    ],

    allowedHeaders: [
      'Content-Type',
    ],
  };

  server.use(router.allowedMethods());
  server.use(cors(corsOpts));
  server.use(koaBody());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
