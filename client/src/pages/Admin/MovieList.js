import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import MovieForm from "./MovieForm";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { getAllMovies } from "../../api/movies";
import moment from "moment";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteMovieModal from "./DeleteMovieModal";
function MovieList() {
//   const fakeMovies = [
//     {
//       key: "1",
//       poster: "Image1",
//       title: "Stree 2",
//       description: "Horror Comedy",
//       duration: 120,
//       genre: "Comedy",
//       language: "Hindi",
//       releaseDate: "2024-08-12",
//     },
//     {
//       key: "2",
//       poster: "Image1",
//       title: "Joker",
//       description: "Action",
//       duration: 120,
//       genre: "Pshological Thriller",
//       language: "English",
//       releaseDate: "2024-08-12",
//     },
//     {
//       key: "1",
//       poster: "Image1",
//       title: "Tumbad",
//       description: "Horror ",
//       duration: 120,
//       genre: "Comedy",
//       language: "Hindi",
//       releaseDate: "2024-08-12",
//     },
//   ];
  const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (text, data) => {
        return (
          <img
            src={data.poster}
            width="75"
            height="115"
            style={{ objectFit: "cover" }}
          />
        );
      },
    },
    {
      title: "Movie Name",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (text) => {
        return `${text} Min`;
      },
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Language",
      dataIndex: "langugage",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, data) => {
        return moment(data.releaseDate).format("MM-DD-YYYY");
      },
    },
    {
      title: "Action",
      render: (text, data) => {
        return (
          <div>
            <Button
              onClick={() => {
                setIsModalOpen(true);
                setSelectedMovie(data);
                setFormType("edit");
              }}
            >
              <EditOutlined />
            </Button>
            <Button
              onClick={() => {
                setIsDeleteModalOpen(true);
                setSelectedMovie(data);
              }}
            >
              <DeleteOutlined />
            </Button>
          </div>
        );
      },
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formType, setFormType] = useState("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  // const loader = useSelector((state) => state.loader);
  const getData = async () => {
    dispatch(ShowLoading()); // Show loading spinner because loader = true
    const response = await getAllMovies();
    const allMovies = response.data;
    setMovies(
      allMovies.map(function (item) {
        return { ...item, key: `movie-${item._id}` };
      })
    );
    dispatch(HideLoading()); // Hide loading spinner because loader = false
  };
  useEffect(() => {
    getData();
  }, []);
  // if(loader){
  //   return <h1>Loading...</h1>
  // }
  return (
    <div className="d-flex justify-content-end">
      <Button
        onClick={() => {
          setIsModalOpen(true);
          setFormType("add");
        }}
      >
        Add Movie
      </Button>
      <Table dataSource={movies} columns={columns} />
      {isModalOpen && (
        <MovieForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          formType={formType}
          getData={getData}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteMovieModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          getData={getData}
        />
      )}
    </div>
  );
}
export default MovieList;