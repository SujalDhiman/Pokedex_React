import { useEffect, useState } from "react"
import axios from "axios";
import "./App.css"

function Card({name,ability,image})
{
    return (
        <div className="card">
            <h3>{name}</h3>
            <h3>{ability}</h3>
            <img src={image} alt="pokemon" />
        </div>
    )
}


function App(){

    const [loading,setLoading]=useState(true)
    const [pokemonlist,setPokemonList]=useState([])
    const [url,setUrl]=useState("https://pokeapi.co/api/v2/pokemon")

    async function changeUrl(e)
    {
        const response=await axios.get(url)
        const data=response.data
        console.log(data);
        if(e.target.className === "next" && data.next !== "null")
        {   
            console.log("hello next")
            setLoading(true)
            setUrl(data.next)
        }
        else
        {
            if(data.previous !== null)
            {
                console.log("hello prev")
                setLoading(true)
                setUrl(data.previous)
            }
            else
            {
                console.log("no prev")
            }
        }
    }


    useEffect(()=>{
        async function pokemonAPI(){
            const response=await axios.get(url)
            let listOfPokemons=response.data.results.map((ele)=>axios.get(ele.url))
            listOfPokemons=await axios.all(listOfPokemons)
            listOfPokemons=listOfPokemons.map((ele)=>({
                name:ele.data.name,
                abilities:ele.data.abilities[0].ability,
                image:ele.data.sprites.other.dream_world.front_default
            }))
            setPokemonList([...listOfPokemons])
            setLoading(!loading)
        }
        pokemonAPI()
    },[url])

    return (
        <>
        <div className="container">
            
            {loading ? "Data is loading" : pokemonlist.map((ele,idx)=><Card key={idx} name={ele.name} ability={ele.abilities.name} image={ele.image} />)}
        </div>

        <button className="next" onClick={changeUrl}>NEXT</button>
        <button className="prev" onClick={changeUrl}>PREVIOUS</button>
        </>

    )

}

export default App