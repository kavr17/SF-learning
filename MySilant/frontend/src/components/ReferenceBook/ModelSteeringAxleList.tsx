import React, {useEffect, useState} from "react";
import {ApiError, ModelSteeringAxle, ModelsteeringaxleService} from "../../api";
import Table from "react-bootstrap/Table";
import "../../styles/ReferenceBook.css";
import { Modal, Button } from "react-bootstrap";


function ModelSteeringAxleItem(props:ModelSteeringAxle) {

    const [showModal, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [showModalDel, setShowDel] = useState(false);
    const handleShowDel = () => setShowDel(true);
    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    const handleCloseDel = () => setShowDel(false);

    function handleClose() {
        setShow(false);
        setTitle(props.title);
        setDescription(props.description)
    }

    function Update(id = props.id) {
        ModelsteeringaxleService.modelsteeringaxleUpdate(
            id,
            {
                id,
                title,
                description
            }).catch((err:ApiError) => {
            console.log(JSON.stringify(err))
        })
    }

    function handleUpdate() {
        setShow(false);
        Update()
    }

    function handlDelete() {
        ModelsteeringaxleService.modelsteeringaxleDelete(props.id);
        window.location.reload()
    }

    return (

        <tr className={"modelsteeringaxle"}>
            <td>{title}</td>
            <td>{description}</td>
            <td>
                <>
                    <div className="d-flex align-items-center justify-content-center .btn-sm">
                        <Button variant="outline-secondary" onClick={handleShow}>
                            Редактировать
                        </Button>
                        <Button variant="outline-secondary"
                                data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={handleShowDel}>
                            Удалить
                        </Button>
                    </div>
                    <Modal show={showModalDel} onHide={handleCloseDel} id="btn-del">
                        <Modal.Header closeButton>
                            <Modal.Title>Удалить?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={handleCloseDel}>
                                Нет
                            </Button>
                            <Button variant="outline-secondary" onClick={handlDelete}>
                                Да
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showModal} onHide={handleClose} >
                        <Modal.Header closeButton>
                            <Modal.Title>Изменить модель управляемого моста</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form className="filter2">
                                <p>Наименование:</p>
                                <input type="text" value={title}
                                       onChange={e => setTitle(e.target.value)}></input>
                                <p>Описание:</p>
                                <textarea id='description-mml' value={description}
                                          onChange={e => setDescription(e.target.value)}></textarea>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={handleUpdate}>
                                Сохранить
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            </td>
        </tr>
    );

}

export default function ModelSteeringAxleList({isLoggedIn, token}:any) {
    const [modelsteeringaxles, setModelSteeringAxles] = useState<ModelSteeringAxle[]>();
    // if (isLoggedIn === 'true') {}
    const loadModelSteeringAxle  = async () => {
        setModelSteeringAxles(await ModelsteeringaxleService.modelsteeringaxleList())

    };
    // if (isLoggedIn === 'true')
    useEffect(() => {
        loadModelSteeringAxle().catch((err:ApiError) => {
            console.log(JSON.stringify(err))
        });
    }, [])


    const [showModal, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    function handleSave() {
        ModelsteeringaxleService.modelsteeringaxleCreate(
            {
                title,
                description
            }
        ).catch((err:ApiError) => {
            console.log(JSON.stringify(err))
        })
        setShow(false);
        window.location.reload()
    }

    return (
        <div>
            { isLoggedIn === 'true' &&
                <>
                    <h3>Справочник моделей управляемого моста</h3>
                    <div className="table2">
                        <Table striped bordered hover className={"table22"}>
                            <thead><tr><th>Наименование модели</th><th>Описание</th><th>
                                <>
                                    <Button variant="outline-secondary" onClick={handleShow}>
                                        Добавить модель
                                    </Button>
                                    <Modal show={showModal} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Добавить модель управляемого моста</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form className="filter2">
                                                <p>Наименование:</p>
                                                <input type="text" value={title}
                                                       onChange={e => setTitle(e.target.value)}></input>
                                                <p>Описание:</p>
                                                <textarea id='description-mml' value={description}
                                                          onChange={e => setDescription(e.target.value)}></textarea>
                                            </form></Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="outline-secondary" onClick={handleSave}>
                                                Сохранить
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </>
                            </th>
                            </tr></thead>
                            <tbody>
                            {modelsteeringaxles && modelsteeringaxles.map(modelsteeringaxle =>
                            {return <ModelSteeringAxleItem key={modelsteeringaxle.id} {...modelsteeringaxle}/>;})}
                            </tbody>
                        </Table>
                    </div>
                </>
            }
            { isLoggedIn !== 'true' &&
                <h1>Вы не авторизированы!</h1>
            }
        </div>
    );
}
