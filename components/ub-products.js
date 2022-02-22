import UbDdatatable from "./tg-productsDatatable";

export default function Products () {
    return (
        <main className="container pt-3 mb-3 tg-products">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 td-heading">
                <h4 className="h4">Data</h4>
            </div>

            <div  className="shadow bg-light p-2">
                <UbDdatatable/>
            </div>
            
            </main>

    )
}