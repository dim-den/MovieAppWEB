import React, { useState } from "react";
import "./SearchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { makeTokenizedRequest } from '../../utils/Common';

function SearchBar({ placeholder }) {
    const [films, setFilms] = useState([]);
    const [actors, setActors] = useState([]);
    const [wordEntered, setWordEntered] = useState("");

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);

        if (searchWord === "") {
            clearInput();
        } else {
            makeTokenizedRequest('/api/film?title=' + searchWord)
                .then(response => setFilms(response.data));

            makeTokenizedRequest('/api/actor?surname=' + searchWord)
                .then(response => setActors(response.data));
        }
    };

    const calculate_age = (date) => {  
        var diff_ms = Date.now() - (new Date(date)).getTime();
        var age_dt = new Date(diff_ms); 
      
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    const clearInput = () => {
        setFilms([]);
        setActors([]);
        setWordEntered("");
    };

    return (
            

        <div className="search">
            <div className="searchInputs">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={wordEntered}
                    onChange={handleFilter}
                />
                <div className="searchIcon">
                    {films.length === 0 && actors.length === 0 ? (
                        <SearchIcon />
                    ) : (
                        <CloseIcon id="clearBtn" onClick={clearInput} />
                    )}
                </div>
            </div>

            { films.length !== 0 && (
                <div className="dataResult">
                    {films.map((item) => {
                        let path = "film/" + item.id;
                        return (
                            <a className="dataItem" href={path}>
                                <p>{item.title} ({item.director}, {item.country})</p>
                            </a>
                        );
                    })}
                </div>
            )}

            { actors.length !== 0 && (
                <div className="dataResult">
                    {actors.map((item) => {
                         let path = "actor/" + item.id;
                        return (
                            <a className="dataItem" href={path}>
                                <p>{item.name} {item.surname} ({calculate_age(item.birthday)} years, {item.country}) </p>
                            </a>
                        );
                    })}
                </div>
            )}


        </div>
    );
}

export default SearchBar;