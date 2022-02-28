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
const RapidKey = '248e1c7a7emsh88651add95cb2fep1af877jsn686d7d00b75a';
const date = require('date-and-time');

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
                const { shop, accessToken, scope } = ctx.state.shopify;
                const host = ctx.query.host;
                ACTIVE_SHOPIFY_SHOPS[shop] = scope;
                ACTIVE_SHOPIFY_SHOPS["ShopOrigin"] = shop;
                ACTIVE_SHOPIFY_SHOPS["AccessToken"] = accessToken;
                ACTIVE_SHOPIFY_SHOPS["AdminId"] = ctx.state.shopify.id;
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

    router.post("/api/import-product", koaBody(), async (ctx) => {
        const GetProduct = ctx.request.body.product
        var GetPostdata = ctx.request.body.product.aliexpres
        var interval = 5000;
        let flag = 0;
        let error = false;
        const allimages = [];
        const LoginId = 'dr__5fbbac868397bc31e7fd';

       // check user exist or not //
        var config = {
            method: "get",
            url: `${baseURL}/customers/stores/`+LoginId,
            headers: {},
            };
            const shopifyStoresDataGet = await axios(config)
            .then(async function (response) {
           // console.log("User Catch", response.data)
           // response.data.includes("Banana", 3);
            })
            .catch(function (error) {
            console.log(error);
            });
        // check user exist or not //

        var images = GetProduct.product_images;
        await images.forEach(async function loop(itemimg) {
            var createdimage = {
                "src": itemimg.originalSrc,
            }
            allimages.push(createdimage)
        });
        var createdjsondata = {
            "product": {
                "title": GetProduct.product_title,
                "body_html": GetProduct.product_description,
                "vendor": "Adserea",
                "tags": "Adserea Product Import",
                "variants": [{ "price": GetProduct.product_price }]
            }
        }
        let AccessToken = ACTIVE_SHOPIFY_SHOPS["AccessToken"];
        let CIShopOrigin = ACTIVE_SHOPIFY_SHOPS["ShopOrigin"];
        const client = new Shopify.Clients.Rest(process.env.SHOP, AccessToken);
        const orderdata = await client.post({
            path: 'products',
            data: createdjsondata,
            type: DataType.JSON
        }).then(async data => {
            console.log("Product inserted and process to next....", data.body.product.id);
            const ProductInsId = data.body.product.id
            await GetPostdata.forEach(async function loop(el, index) {
                setTimeout(async function () {
                    var productlinks = el.link
                    var path = productlinks.split("/item/");
                    var path2 = path[1].split(".");
                    const exportpro_id = path2[0];
                    var options = {
                        method: 'GET',
                        url: 'https://magic-aliexpress1.p.rapidapi.com/api/product/' + exportpro_id,
                        headers: {
                            'x-rapidapi-host': 'magic-aliexpress1.p.rapidapi.com',
                            'x-rapidapi-key': RapidKey
                        }
                    };
                    if (!flag) {
                        const createdjsonloc = [];
                        const ResGet = await axios.request(options).then(async function (response) {
                            if ((response != null) || (response.data.name != 'No product found in Aliexpress API, DB & Scrapping')) {
                                var itemvariantslocation = response.data.skuProperties;
                                await itemvariantslocation.forEach(async function loop(itemloc) {
                                    var createdjsonlocdata = itemloc.skuPropertyName
                                    createdjsonloc.push(createdjsonlocdata)
                                });
                                const CheckCountry = !createdjsonloc.includes('ShipsFrom', 'Plugstandard')
                                if (CheckCountry == true) {
                                    ProductAddInStore(ProductInsId, response, allimages)
                                    flag++;
                                    // console.log('flag 1', flag);
                                }
                            } else {
                                console.log('else part');
                            }
                        }).catch(function (error) {
                            error = true;
                        });
                    } else {
                        // console.log('Not running', flag);
                    }
                }, index * interval);
            });
            ctx.body = { 'status': true, 'message': 'Product upload successfully' };
            ctx.status = 200;
        }).catch(function (error) {
            console.log("Product not inserted.", error);
            ctx.body = { 'status': false, 'message': "Product not upload", 'error': error };
            ctx.status = 200;
        })


        await new Promise(resolve => setTimeout(resolve, 20000));
        console.log("Upload successfully.")
    });

    async function ProductAddInStore(ProductInsId, response, allimages) {
        const createdjsonFields = [];
        const allItems2 = [];
        const mergeimages = [];
        const megamergeimages = [];
        var itemvariantslocation = response.data.skuList;
        var itemskuProperties = response.data.skuProperties;
        let finalArr = {};
        await itemskuProperties.forEach(async function loop(itemdssku) {
            var skuPropertyName = itemdssku.skuPropertyName;
            var skuPropertyValues = itemdssku.skuPropertyValues;
            await skuPropertyValues.forEach(async function loop(itemdarr) {
                var propertyValueId = itemdarr.propertyValueId;
                var propertyValueName = itemdarr.propertyValueDisplayName;
                var createdoptionfield = {
                    "skuPropertyName": skuPropertyName,
                    "propertyValueName": propertyValueName
                }
                finalArr[propertyValueId] = createdoptionfield;
            })
        })
        await itemvariantslocation.forEach(async function loop(itemvarid) {
            var sepid = itemvarid.skuPropIds;
            var price = itemvarid.skuVal.skuCalPrice;
            var availQuantity = itemvarid.skuVal.availQuantity;
            var pathid = sepid.split(",");
            if (price < 20) {
                price = price * 3
            }
            else if (price >= 20 && price <= 40) {
                price = price * 2.5
            }
            else { price = price * 2.
            }
            let variantJson = {};
            for (var a in pathid) {
                var variable = pathid[a];
                var barcodes = '';
                var propertyValueName = finalArr[variable]['propertyValueName'];
                a = parseInt(a) + 1;
                variantJson['option' + a] = barcodes =propertyValueName;
                variantJson['price'] = price;
                variantJson['inventory_quantity'] = availQuantity;
                variantJson['inventory_management'] = "shopify";
                variantJson['barcode'] = barcodes;
            }
            allItems2.push(variantJson)
        });
      
        var itemvariantslocation = response.data.skuProperties;
        await itemvariantslocation.forEach(async function loop(itemloc) {
            var createdoptionfield = {
                "name": itemloc.skuPropertyName
            }
            createdjsonFields.push(createdoptionfield)
        });
        var itemvariantsimg = response.data.skuProperties[0].skuPropertyValues;
        await itemvariantsimg.forEach(async function loop(itemimages) {
            var createdimg = {
                "src": itemimages.skuPropertyImagePath,
                "alt": itemimages.propertyValueDisplayName,
            }
            mergeimages.push(createdimg)
        });
        var MegaIMages = allimages.concat(mergeimages);
        var createdjsondata = {
            "product": {
                "product_type": response.first_level_category_name,
                "status": "active",
                "variants": allItems2,
                "options": createdjsonFields,
                "images": MegaIMages
            }
        }
        let CIAccessToken = ACTIVE_SHOPIFY_SHOPS["AccessToken"];
        let CIShopOrigin = ACTIVE_SHOPIFY_SHOPS["ShopOrigin"];
        let AdminId = ACTIVE_SHOPIFY_SHOPS["iAdminIdd"];
        const ProductName = response.product_title
        var itemvarr = JSON.stringify(allItems2);
        const client = new Shopify.Clients.Rest(process.env.SHOP, CIAccessToken);
        const orderdata = await client.put({
            path: 'products/' + ProductInsId,
            data: createdjsondata,
            type: DataType.JSON
        }).then(async data => {
                var VariantDatas = data.body.product.variants;
                var Variantimm = data.body.product.images;

                await VariantDatas.forEach(async function loop(ProVarr) {
                   var Variantid =  ProVarr.id
                   var barcode =  ProVarr.option1
                   var aquaticCreatures =  Variantimm.filter(async function(Variantimm) {
                    if(Variantimm.alt == barcode)
                    {
                        var imgstid = Variantimm.id;
                        const dataimms = await client.put({
                            path: 'variants/'+Variantid,
                            data: {"variant":{"id":Variantid,"image_id":imgstid}},
                            type: DataType.JSON,
                            });

                    }
                  })
                });


              
                

    
          //  return data;
        }).catch(function (error) {
            //  console.log("Product not update");
           // return error;
        })


        
      
    }

    /* Create custome code */
    router.post("/setuser", async (ctx) => {
        //let AdminId = 'dr__5fbbac868397bc31e7fd';
        let CIAccessToken = ACTIVE_SHOPIFY_SHOPS["AccessToken"];
        let CIShopOrigin = ACTIVE_SHOPIFY_SHOPS["ShopOrigin"];
        let AdminId = ACTIVE_SHOPIFY_SHOPS["iAdminIdd"];
        var config = {
            method: "post",
            url: baseURL + 'customers/' + AdminId,
            headers: { "Content-Type": "application/json" },
            data: {
                "shopify_url": CIShopOrigin + '/',
                "access_token": CIAccessToken
            },
        };
        let response = { error: true };
        const UserResponse = await axios(config)
            .then(async function (response) {
                ctx.body = response.data;
                ctx.status = 200;
            }).catch(function (error) {
                if (error.response.data.status) {
                    ctx.body = error.response.data;
                    ctx.status = 200;
                }
            });
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
