import React from "react";
// import { Button, Input, Form } from "antd";
// import { Link } from "react-router-dom";
import { Button, Input, Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../api/users";

function Login() {
  const navigate = useNavigate();
  const onFinish = async (value) => {
    console.log(value);
    try {
      const response = await LoginUser(value);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        navigate("/");
      } else {
        message.error(response.message);
      }
    } catch (err) {
      console.log(err);
      message.error("Something went wrong");
    }
  };
  return (
    <>
      <main className="App-header">
        <h1>Login to Book My Show</h1>
        <section className="mw-500 text-center px-3">
          
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              htmlFor="email"
              name="email"
              className="d-block"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter you email"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              htmlFor="password"
              name="password"
              className="d-block"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Enter you Password"
              />
            </Form.Item>
            <Form.Item className="d-block">
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ fontSize: "1rem", fontWeight: "600" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <div>
            <p>
              {" "}
              New User? <Link to="/register">Register Here</Link>
            </p>
            <p>
               Forgot Password ? <Link to="/forget">Click Here</Link>
             </p>
          </div>
        </section>
      </main>
    </>
  );
}
export default Login;
