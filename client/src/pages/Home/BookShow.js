import { useState, useEffect } from "react";
 import { useParams, useNavigate } from "react-router-dom";
 import { useDispatch, useSelector } from "react-redux";
 import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
 import { message, Input, Divider, Row, Col, Card, Button } from "antd";
 import { getShowById } from "../../api/shows";
 import moment from "moment";
 import StripeCheckout from "react-stripe-checkout";
 import { bookShow, makePayment } from "../../api/bookings";

 const BookShow = () => {
   const { user } = useSelector((state) => state.users);
   const dispatch = useDispatch();
   const [show, setShow] = useState();
   const [selectedSeats, setSelectedSeats] = useState([]);
   const params = useParams();
   const navigate = useNavigate();
 
   const getData = async () => {
     try {
       dispatch(ShowLoading());
       const response = await getShowById({ showId: params.id });
       if (response.success) {
         setShow(response.data);
         console.log(response.data);
       } else {
         message.error(response.message);
       }
       dispatch(HideLoading());
     } catch (err) {
       message.error(err.message);
     }
   };
 
   const getSeats = () => {
     const columns = 12;
     const totalSeats = 120;
     const rows = totalSeats / columns;
 
     return (
       <div className="d-flex flex-column align-items-center">
         <div className="w-100 max-width-600 mx-auto mb-25px">
           <p className="text-center mb-10px">
             Screen this side, you will be wathching in this direction
           </p>
           <div className="screen-div"></div>
         </div>
         <ul className="seat-ul justify-content-center">
           {Array.from(Array(rows).keys()).map((row) => 
             Array.from(Array(columns).keys()).map((column) => {
               let seatNumber = row * columns + column + 1;
               console.log("seats", seatNumber);
               let seatClass = "seat-btn"; //default class for seat btn
               if (selectedSeats.includes(seatNumber)) {
                 seatClass += " selected"; // "seat-btn selected"
               }
               if (show.bookedSeats.includes(seatNumber)) {
                 seatClass += " booked";
               }
               console.log("totalSeats", totalSeats);
               if (seatNumber <= totalSeats) {
                 console.log("rendering seats", seatNumber);
                 return (
                   <li key={seatNumber}>
                     <Button
                       className={seatClass}
                       onClick={() => {
                         if (selectedSeats.includes(seatNumber)) {
                           setSelectedSeats(
                             selectedSeats.filter((seat) => seat !== seatNumber)
                           );
                         } else {
                           setSelectedSeats([...selectedSeats, seatNumber]);
                         }
                       }}
                     >
                       {seatNumber}
                     </Button>
                   </li>
                 );
               }
            })
        )}
         </ul>
         <div className="d-flex bottom-card justify-content-between w-100 max-width-600 mx-auto mb-25px mt-3">
           <div>
             Selected Seats: <span>{selectedSeats.join(", ")}</span>
           </div>
           <div>
             Total Price:{" "}
             <span>Rs. {selectedSeats.length * show.ticketPrice}</span>
           </div>
         </div>
       </div>
     );
   };
 
   useEffect(() => {
     getData();
   }, []);

   const book = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await bookShow({
        show: params.id,
        transactionId,
        seats: selectedSeats,
        user: user._id,
      });
      if (response.success) {
        message.success(response.message);
        navigate("/profile");
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    }
  };



  const onToken = async (token) => {
    console.log(token);
    try {
      dispatch(ShowLoading());
      const response = await makePayment(
        token,
        selectedSeats.length * show.ticketPrice * 100
      );
      if (response.success) {
        message.success(response.message);
        book(response.data);
        console.log(response);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(HideLoading());
    }
  };
   

 
   return (
     <>
       {show && (
         <Row gutter={24}>
           <Col span={24}>
             <Card
               title={
                 <div className="movie-title-details">
                   <h1>{show.movie.title}</h1>
                   <p>
                     Theatre: {show.theatre.name}, {show.theatre.address}{" "}
                   </p>
                 </div>
               }
               extra={
                 <div className="show-name py-3">
                   <h3>Show Name:{show.name}</h3>
                   <h3>
                     <span>Date & Time:</span>
                     {moment(show.date).format("MMM Do YYYY")}, {show.time}
                   </h3>
                   <h3>
                     <span>Ticket Price:</span> Rs. {show.ticketPrice}
                   </h3>
                   <h3>
                     <span>Total Seats:</span> {show.totalSeats}
                   </h3>
                   <h3>
                     <span>Available Seats:</span>
                     {(show.totalSeats = show.bookedSeats.length)}
                   </h3>
                 </div>
               }
             >
               {getSeats()}
               {selectedSeats.length > 0 && (
                 <StripeCheckout
                   token={onToken}
                   amount={selectedSeats.length * show.ticketPrice * 100}
                   stripeKey="pk_test_51RFy09PiQ2bDqSotOuoPDHRwzEe6j4aWXTFsbsCaVz1IhQdOKC66ZBmbFGRui4PuitXFKIiigbSh0tzj1yWNtb5k00Y2EmryW0"
                 >
                   <div className="max-width-600 mx-auto">
                     <Button type="primary" shape="round" size="large" block>
                       Pay Now
                     </Button>
                   </div>
                 </StripeCheckout>
               )}
             </Card>
           </Col>
         </Row>
       )}
     </>
   );
 };
 
 export default BookShow;