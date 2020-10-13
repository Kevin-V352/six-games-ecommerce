import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, FormControl } from 'react-bootstrap';
import axios from 'axios';
import NavAdmin from '../NavAdmin/nav_admin.jsx';

const FormAdminModify = () => {

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productCategories, setProductCategories] = useState ([]);
    const [loading, setLoading] = useState(true);
    const [productSelected, setProductSelected] = useState(false);
    const [inputSearch, setInputSearch] = useState({ searchInput: "" });
    const searchInput =useRef(null);
    const [inputAdminForm, setInputAdminForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        developer: "",
        publisher: "",
        publishDate: ""
    });

    let clickedOption;
    let categorySelectedToDelete;
    let categorySelectedToAdd;

    function getCategories() {
        axios.get(`http://localhost:3000/products/category/`)
            .then(response => {
                setCategories(response.data);
            });
    }

    const getProducts = () => {
        axios.get(`http://localhost:3000/products/`)
            .then(response => {
                setProducts(response.data);
            });
    }

    useEffect(() => {
        getCategories();
        getProducts();
        setLoading(false);
        searchInput.current.focus()
    }, [loading]);

    const handleInputChangeForm = (event) => {
        setInputAdminForm({
            ...inputAdminForm,
            [event.target.name]: event.target.value
        });
    };
    
    const handleInputChangeSearch = (event) => {
        setInputSearch({
            ...inputSearch,
            [event.target.name]: event.target.value
        });
    };

    const handleSelectChange = (event) => {
        let selector = document.getElementById("productList");
        clickedOption = selector.options[selector.selectedIndex].id;
        refreshData(clickedOption);
    }

    const refreshData = (id) => {
        
        axios.get(`http://localhost:3000/products/${id}`).then(response => {
            setInputAdminForm(response.data);
            setProductSelected(true);
            setProductCategories(response.data.categories); 
            let prodCat = response.data.categories;
            let loadedCat = categories.filter((item) => {
                return !prodCat.find(el => el.name === item.name);
            })  
            setCategories(loadedCat);   
        })
    }

    const handleSubmit = (id) => {
        axios.put(`http://localhost:3000/products/${id}`, {
            name: inputAdminForm.name,
            description: inputAdminForm.description,
            price: inputAdminForm.price,
            stock: inputAdminForm.stock,
            developer: inputAdminForm.developer,
            publisher: inputAdminForm.publisher,
            publishDate: inputAdminForm.publishDate
        })
    }

    const handleCheckChange = (event) => {
        let formCheck = document.getElementById(event.target.name);
        formCheck.disabled = !formCheck.disabled
    }

    const handleCategoryDelete = () => {
        let selector = document.getElementById("formProductCategories");
        categorySelectedToDelete = selector.options[selector.selectedIndex].id;
    }

    const handleCategoryAdd = () => {
        let selector = document.getElementById("formCategories");
        categorySelectedToAdd = selector.options[selector.selectedIndex].id;
    }

    const deleteCategoryProduct = (e, idC) => {
        let selector = document.getElementById("productList");
        let idP = selector.options[selector.selectedIndex].id;
        e.preventDefault();
        axios.delete(`http://localhost:3000/products/${idP}/category/${idC}`)
        .then(res => {
            if(!alert('Categoria eliminada!')) window.location.reload()
        })
    }

    const addCategoryProduct = (e, idC) => {
        let selector = document.getElementById("productList");
        let idP = selector.options[selector.selectedIndex].id;
        console.log(idC, 'ura', idP);
        e.preventDefault();
        axios.post(`http://localhost:3000/products/${idP}/category/${idC}`)
        .then(() => {
            if(!alert('Categoria agregada!')) window.location.reload()
        })
    }

    let showProducts = products.filter(product => product.name.toLowerCase().includes(inputSearch.searchInput.toLowerCase()))

    return (
    <div>
            {/* Opciones para CRUD del producto */}
            <NavAdmin/>
            <h1 className='formAdmin-title'>Modificar datos del producto</h1>

            <Form >
                <FormControl
                    type="text"
                    placeholder="Search your game"
                    className="mr-sm-2"
                    name="searchInput"
                    ref={searchInput}
                    onChange={(event) => handleInputChangeSearch(event)} />
            </Form>
            <Form.Group>
                <Form.Control as="select" multiple id="productList" onChange={(e) => handleSelectChange(e)}>
                    {
                        showProducts.map(product => (
                            <option id={product.id} >
                                {product.name}
                            </option>
                        ))
                    }
                </Form.Control>
            </Form.Group>

            <br/>
            { productSelected && 
            (
            /* Formulario para modificar o crear el producto */
            <Form onSubmit={() => handleSubmit(inputAdminForm.id)}>
                <Form.Group>
                    <Form.Check 
                        type="checkbox"
                        name="formName"
                        onChange={(event) => handleCheckChange(event)}
                    />
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text"
                        placeholder="Nombre del juego"
                        value={inputAdminForm.name}
                        name="name"
                        id="formName"
                        onChange={(event) => handleInputChangeForm(event)} disabled/>
                    <br />
                    <Form.Check 
                        type="checkbox"
                        name="formDescription"
                        onChange={(event) => handleCheckChange(event)}
                    />
                    <Form.Label>Descripcion</Form.Label>
                    <Form.Control type="text"
                        placeholder="Descripcion del juego"
                        value={inputAdminForm.description}
                        name="description"
                        id="formDescription"
                        onChange={(event) => handleInputChangeForm(event)} disabled/>
                    <br />
                    <Form.Check 
                        type="checkbox"
                        name="formPrice"
                        onChange={(event) => handleCheckChange(event)}
                    />
                    <Form.Label>Precio</Form.Label>
                    <Form.Control type="number"
                        placeholder="Precio del juego"
                        value={inputAdminForm.price}
                        name="price"
                        id="formPrice"
                        onChange={(event) => handleInputChangeForm(event)} disabled/>
                    <br />
                    <Form.Check 
                        type="checkbox"
                        name="formStock"
                        onChange={(event) => handleCheckChange(event)}
                    />
                    <Form.Label>Stock disponible</Form.Label>
                    <Form.Control type="number"
                        placeholder="Stock disponible del juego"
                        value={inputAdminForm.stock}
                        name="stock"
                        id="formStock"
                        onChange={(event) => handleInputChangeForm(event)} disabled/>
                    <br />
                    <Form.Check 
                        type="checkbox"
                        name="formDeveloper"
                        onChange={(event) => handleCheckChange(event)}
                    />
                    <Form.Label>Desarrollado por:</Form.Label>
                    <Form.Control type="text"
                        placeholder="Desarrolladora del juego"
                        value={inputAdminForm.developer}
                        name="developer"
                        id="formDeveloper"
                        onChange={(event) => handleInputChangeForm(event)} disabled/>
                    <br />
                    <Form.Check 
                        type="checkbox"
                        name="formPublisher"
                        onChange={(event) => handleCheckChange(event)}
                    />
                    <Form.Label>Publicado por:</Form.Label>
                    <Form.Control type="text"
                        placeholder="Publicadora del juego"
                        value={inputAdminForm.publisher}
                        name="publisher"
                        id="formPublisher"
                        onChange={(event) => handleInputChangeForm(event)} disabled/>
                    <br />
                    <Form.Check 
                        type="checkbox"
                        name="formPublishDate"
                        onChange={(event) => handleCheckChange(event)}
                    />
                    <Form.Label>Fecha de lanzamiento:</Form.Label>
                    <Form.Control type="date"
                        placeholder="Fecha de lanzamiento del juego"
                        value={inputAdminForm.publishDate}
                        name="publishDate"
                        id="formPublishDate"
                        onChange={(event) => handleInputChangeForm(event)} disabled/>
                     <br />
                    <Form.Label>Categorias del producto:</Form.Label>
                    <Form.Control as="select" multiple id="formProductCategories" 
                        onClick={(e) => handleCategoryDelete(e)}> 
                        {
                            productCategories.map(cat => (
                                <option id={cat.id}>{cat.name}</option>
                            ))
                        }
                    </Form.Control>  
                    <Button variant="danger" type="submit"
                    onClick={(e) => deleteCategoryProduct(e, categorySelectedToDelete)}> Eliminar </Button>  
                    <br />

                    <Form.Label>Categorias disponibles:</Form.Label>
                    <Form.Control as="select" multiple id="formCategories" 
                        onClick={(e) => handleCategoryAdd(e)}> 
                        {
                            categories.map(cat => (
                                <option id={cat.id}> {cat.name} </option>
                            ))
                        }
                    </Form.Control>
                    <Button variant="success" type="submit" 
                    onClick={(e) => addCategoryProduct(e, categorySelectedToAdd)}> Agregar </Button>  
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>)
            }
        </div>
    )

}

export default FormAdminModify;