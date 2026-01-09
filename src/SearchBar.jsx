const SearchBar = ({clientCode, lastName, setClientCode, setLastName, handleSubmit}) => {
    return (
        <div className="form">
          <h2>Search by:</h2>
          <div className="flex">
            <div>
              <label for="lastName">Last Name</label>
              <input 
              id="lastName" 
              type="text" 
              onChange={(e) => setLastName(e.target.value)}
              disabled={clientCode ? true : false}
              />
            </div>

            <div class="slash"></div>

            <div>
              <label for="clientCode">Client Code</label>
              <input 
              id="clientCode" 
              type="text" 
              onChange={(e) => setClientCode(e.target.value)}
              disabled={lastName ? true : false}
              />
            </div>
          </div>

          <button className="btn" onClick={handleSubmit}>Submit</button>
        </div>)
}

export default SearchBar;