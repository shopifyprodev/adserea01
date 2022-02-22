import React from 'react';
import UbDdatatable from "./tg-pagesDatatable";


export default function Pages () {
  const [modalShow, setModalShow] = React.useState(false);
  
    return (
      <main className="container pt-3 mb-3 tg-pages">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 td-heading">
            <h4 className="h4">Pages</h4>
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
                  <td>About Us</td>
                  <td>
                    Enable
                  </td>
                  <td>
                    <button type="button" className="btn btn-info btn-sm me-2">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td><input type="checkbox" aria-label="Checkbox for following text input" className="m-2" /></td>
                  <td>02</td>
                  <td>Contact Us</td>
                  <td>
                    Desable
                  </td>
                  <td>
                    <button type="button" className="btn btn-info btn-sm me-2">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td><input type="checkbox" aria-label="Checkbox for following text input" className="m-2" /></td>
                  <td>03</td>
                  <td>Enquiry</td>
                  <td>
                    Enable
                  </td>
                  <td>
                    <button type="button" className="btn btn-info btn-sm me-2" onClick={() => setModalShow(true)}>Edit</button>
                    <Popupmodal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                    />
                    <button type="button" className="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}
        </main>
    )
}


function Popupmodal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Page
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Product Type</Form.Label>
          <Form.Control type="text" placeholder="" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="Form.ControlTextarea1">
          <Form.Label>Body HTML</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
      </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
        <Button className='primary'>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}