import {  useState,useEffect } from 'react';
import {  useNavigate,useLocation } from 'react-router-dom'

export default function Search () {

    const navigate = useNavigate();
    const location = useLocation();//give details abt now in wt location
    const [keyword, setKeyword] = useState("")//this is for keyword in url

    const searchHandler = (e) => {
        e.preventDefault();//will stop brower from reload
        navigate(`/search/${keyword}`)

    }
//even after coming to home page the search product name still there didt disappeared so for that below
    const clearKeyword = () =>{
        setKeyword("");
    }
//normally after component got loaded next will be useeffect
//so after loading to home page it will automatically clear the search product name from search bar:
    useEffect(() => {
        if(location.pathname === '/') {
            clearKeyword();
        }
    },[location])

    return (
        <form onSubmit={searchHandler}>
            <div className="input-group">
                <input
                type="text"
                id="search_field"
                className="form-control"
                placeholder="Enter Product Name ..."
                onChange={(e)=>{ setKeyword(e.target.value) }}
                defaultValue={keyword}
                />
                <div className="input-group-append">
                <button id="search_btn" className="btn">
                    <i className="fa fa-search" aria-hidden="true"></i>
                </button>
                </div>
            </div>
        </form>
    )
}