import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.scss';
import FriendCard from './components/FriendCard';
import PaginationComponent from 'react-reactstrap-pagination';
import { Row, Container, Input, Col, InputGroupText, InputGroupAddon, InputGroup } from 'reactstrap';
import useDebounce from './utils/hooks';


// API URL
const apiURL = `https://60e1c1015a5596001730f1f1.mockapi.io/friends`
const pageSize = 4;

function App() {

  const [value, setValue] = useState("");
  const [sortOrderBy, setSortOrderBy] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // for Search Functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);


  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        setCurrentPage(1);
        axios.get(`${apiURL}?page=${currentPage}&limit=${pageSize}&search=${debouncedSearchTerm}&sortBy=favourite&order=${sortOrderBy ? 'asc' : 'desc'}`)
          .then(res => {
            setIsSearching(false);
            setData(res.data.items)
          });
      } else {
        getFriends();
        setIsSearching(false);
      }
    },
    [debouncedSearchTerm, currentPage] // Only call effect if debounced search term changes
  );

  const handleSort = () => {
    setCurrentPage(1);
    setSortOrderBy(!sortOrderBy);
    axios.get(`${apiURL}?page=${currentPage}&limit=${pageSize}&search=${debouncedSearchTerm}&sortBy=favourite&order=${sortOrderBy ? 'asc' : 'desc'}`)
      .then(res => {
        setData(res.data.items)
      });
  }

  const getFriends = () => {
    axios.get(`${apiURL}?page=${currentPage}&limit=${pageSize}&search=${debouncedSearchTerm}`)
      .then(res => {
        setTotalCount(res.data.count);
        setData(res.data.items);
        setLoading(false);
      });
  }

  const handleKeyPress = (event, type) => {

    const newFriend = {
      name: event.target.value,
      rating: false,
    };

    if (event.key === 'Enter') {
      setLoading(true);

      axios.post(`${apiURL}`, newFriend)
        .then(res => {
          getFriends()
          setValue('')
          setSearchTerm('')
        });

    }
  };

  const toggleFavourite = (friend) => {
    setLoading(true);

    const favourite = !friend.favourite;
    axios.put(`${apiURL}/${friend.id}`, { favourite })
      .then(() => getFriends());
  }

  const handleDelete = (id) => {
    axios.delete(`${apiURL}/${id}`)
      .then(() => getFriends());

  }

  const handleSetCurrentPage = (e, i) => {
    setCurrentPage(e);
  }

  return (

    <Container  >
      <Row className="m-0 p-3 mw-100">
        <Col className="m-auto" lg={12} md="9" sm="12">

          {/* Render Input to search new friend   */}
          <InputGroup
            className="input-field"
          >
            <Input placeholder="Search Friend Name"
              name="search-field"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon addonType="append">
              <InputGroupText>

                {isSearching ? <i className="fa fa-spinner fa-spin" /> : <i className=" fa fa-search" />}


              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>

          <br />

          <center>Sort by your {sortOrderBy ? 'Friend' : 'Favourite Friend'} &nbsp; &nbsp; <button className="icon-button" onClick={handleSort}>
            {sortOrderBy ? (
              <i className="star fa fa-star " />) : (
              <i className="star fa fa-star-o" />
            )}
          </button>
          </center>
        </Col>
      </Row>
      <Row className="app-container">
        <Col className="m-auto" lg={6} md="9" sm="12">

          <InputGroup
            // className="search-field"
            className="input-field"
          >
            <Input
              placeholder="Enter Friend Name"
              // className="friend-field"
              name="friend-field"
              onKeyPress={handleKeyPress}
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
            <InputGroupAddon addonType="append">
              <InputGroupText>

                {loading ? <i className="fa fa-spinner fa-spin" /> : <i className=" fa fa-user" />}
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>





          {/* Render cards */}
          {data.map(friend =>
            <FriendCard
              {...friend}
              key={friend.id}
              toggleFavourite={toggleFavourite}
              handleDelete={handleDelete}
              loading={loading}
            />)}



          {totalCount > 4 && data.length ?
            <PaginationComponent size="sm" firstPageText={'<<'} previousPageText={"<"}
              lastPageText={'>>'}
              nextPageText={'>'} className="pagination-container" totalItems={totalCount} pageSize={pageSize} onSelect={handleSetCurrentPage} />
            : null
          }
        </Col>
      </Row>
    </Container>

  );
}

export default App;
