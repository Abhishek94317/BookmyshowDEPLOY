import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Row, Col, Select, Button, message } from "antd";
import { addTheatre, updateTheatre } from "../../api/theatre";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import moment from "moment";


function TheatreFormModal({
  isModalOpen,
  setIsModalOpen,
  formType,
  selectedTheatre,
  setSelectedTheatre,
  getdata,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (formType === "add") {
        response = await addTheatre({ ...values, owner: user._id });
      } else {
        values.theatreId = selectedTheatre._id;
        response = await updateTheatre(values);
      }
      if (response.success) {
        getdata();
        message.success(response.message);
        setIsModalOpen(false);
      } else {
        message.error(response.message);
      }
      setSelectedTheatre(null);
      // dispatch(HideLoading());
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(HideLoading());
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTheatre(null);
  };

  return (
    <Modal
      centered
      title={formType === "add" ? "Add Theatre" : "Edit Theatre"}
      open={isModalOpen}
      onCancel={handleCancel}
      width={800}
      footer={null}
    >
      <Form
        layout="vertical"
        initialValues={selectedTheatre}
        onFinish={onFinish}
      >
        <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
          <Col span={24}>
            <Form.Item
              label="Theatre Name"
              name="name"
              rules={[{ required: true, message: "Theatre name is required!" }]}
            >
              <Input placeholder="Enter the Theatre name" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Address is required!" }]}
            >
              <TextArea rows="4" placeholder="Enter the address" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Email is required!" }]}
                >
                  <Input type="email" placeholder="Enter the email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Phone Number is required!",
                    },
                  ]}
                >
                  <Input type="number" placeholder="Enter the contact number" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            style={{ fontSize: "1rem", fontWeight: "600" }}
          >
            Submit the Data
          </Button>
          <Button className="mt-3" block onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TheatreFormModal;