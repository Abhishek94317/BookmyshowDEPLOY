import React, { useEffect, useState } from "react";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { getAllMovies } from "../../api/movies";
import { message, Row, Col, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

function Home() {
  // useEffect(() => {
  //   console.log("Home use effect");
  //   const fetchUser = async () => {
  //     const response = await GetCurrentUser();
  //     console.log(response);
  //   };
  //   fetchUser();
  // });
  //return <div>This is my Home Page</div>;
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const data = await getAllMovies();
      dispatch(HideLoading());
      if (data && data.success) {
        setMovies(data.data);
      } else {
        message.error(data.message);
      }
    } catch (err) {
      console.error(err);
      message.error(err.message);
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    console.log(searchText);
  };
  return (
    <>
      <Row className="justify-content-center mb-5 w-100">
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Input
            placeholder="Type here to search for a movie"
            onChange={handleSearch}
            prefix={<SearchOutlined />}
          />
          <br />
          <br />
          <br />
        </Col>
      </Row>
      <Row
        className="justify-content-center"
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
        {movies
          .filter((movie) =>
            movie.title.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((movie) => (
            <Col key={movie._id} span={{ xs: 24, sm: 24, md: 12, lg: 10 }}>
              <div className="text-center">
                <img
                  src={movie.poster}
                  alt="Movie Poster"
                  width={200}
                  height={250}
                  style={{ borderRadius: "8px", objectFit: "cover" }}
                  onClick={() => {
                    navigate(
                      `/movie/${movie._id}?date=${moment().format(
                        "YYYY-MM-DD"
                      )}`
                    );
                  }}
                  className="cursor-pointer"
                />
                <h3
                  onClick={() => {
                    navigate(
                      `/movie/${movie._id}?date=${moment().format(
                        "YYYY-MM-DD"
                      )}`
                    );
                  }}
                  className="cursor-pointer"
                >
                  {movie.title}
                </h3>
              </div>
            </Col>
          ))}
      </Row>
    </>
  );
}

export default Home;

