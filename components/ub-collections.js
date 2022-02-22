import UbDdatatable from "./tg-collectionsDatatable";

export default function Collections () {
    return (
        <main className="container pt-3 mb-3 tg-collections">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 td-heading">
                <h4 className="h4">Dashboard</h4>
            </div>
            <div  className="shadow bg-light p-2">
                <UbDdatatable/>
            </div>
            {/* <div className="table-responsive">
                <table className="table table-striped table-sm">
                <thead>
                    <tr>
                    <th scope="col" width="2.5%" className="p-0"><input type="checkbox" aria-label="Checkbox for following text input" className="m-2" /></th>
                    <th scope="col" width="5%">Sr. No.</th>
                    <th scope="col" width="30%">Title</th>
                    <th scope="col" width="30%">Status</th>
                    <th scope="col" width="20%">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td><input type="checkbox" aria-label="Checkbox for following text input" className="m-2" /></td>
                    <td>01</td>
                    <td>Men</td>
                    <td>
                        Enable
                    </td>
                    <td>
                        <button type="button" className="btn btn-info btn-sm me-2">Edit</button>
                        <button type="button" className="btn btn-danger btn-sm">Delete</button>
                    </td>
                    </tr>
                    <tr>
                    <td><input type="checkbox" aria-label="Checkbox for following text input" className="m-2" /></td>
                    <td>02</td>
                    <td>Women</td>
                    <td>
                        Desable
                    </td>
                    <td>
                        <button type="button" className="btn btn-info btn-sm me-2">Edit</button>
                        <button type="button" className="btn btn-danger btn-sm">Delete</button>
                    </td>
                    </tr>
                    <tr>
                    <td><input type="checkbox" aria-label="Checkbox for following text input" className="m-2" /></td>
                    <td>03</td>
                    <td>Child</td>
                    <td>
                        Enable
                    </td>
                    <td>
                        <button type="button" className="btn btn-info btn-sm me-2">Edit</button>
                        <button type="button" className="btn btn-danger btn-sm">Delete</button>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div> */}
        </main>

    )
}