import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import {InfoCircleOutlined} from '@ant-design/icons';
import { Tooltip,Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';
import {useUpdateEffect} from "react-use"
import { jsPDF } from "jspdf";

export default function ({children}) {
  const [data, setData] = useState(children[0].formulation)
  useEffect (() => {
    setData(children[0].formulation)
  }, children)

  console.log(children)
  console.log(children[0].formulation)

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};




  
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');


  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };
//
  const newPdf = ({coefficient,vendor_email,vendor_name, ...rest}) => {
  console.log([rest])
  const doc = new jsPDF();
  doc.rect(20, 10, 168, 275);

  doc.text("Company name", 45, 15, null, null, "left");
  doc.text("Address", 45, 20, null, null, "left");
  doc.text("Email", 45, 25, null, null, "left");
  doc.line(20, 30, 188,30)


  doc.setFont("helvetica", "bold");
  doc.text("To:", 20, 35);
  doc.setFont("helvetica", "normal");
  doc.text(vendor_name, 20, 40);
  doc.text(vendor_email, 20, 45);

  doc.text("Order date", 110, 35);
  doc.text("PO #: 12345678", 110, 40);

  // var data = [{
  //   code:key,
  //   name: name,
  //   unit_price: unit_price,
  //   //quantity: "XPTO2",
  //   unit: "25",
  //   total_price: "20485861",
  // },
  // {
  //   code:"1",
  //   name: "1000",
  //   unit_price: "GameGroup",
  //   quantity: "XPTO2",
  //   unit: "25",
  //   total_price: "20485861",
  // }];

  function createHeaders(keys) {
  var result = [];
  for (var i = 0; i < keys.length; i += 1) {
    result.push({
      id: keys[i],
      name: keys[i],
      prompt: keys[i],
      width: 65,
      align: "center",
      padding: 0
    });
  }
  return result;
  }

  var headers = createHeaders([ 
  "key",
  "name",
  "unit_price",
  "unit",
  "total_price",

  ]);

  doc.table(45, 60, [rest], headers,{printHeaders:true, autoSize: true, fontSize:12});

    // console.log(record)
    // doc.text(JSON.stringify(record.coefficient).replace(/['"]+/g, ''), 10, 10);
    // // doc.text(JSON.stringify(record.key), 10, 10);
    // // doc.text(JSON.stringify(record.name), 10, 10);
    // // doc.text(JSON.stringify(record.total_price), 10, 10);
    // // doc.text(JSON.stringify(record.unit), 10, 10);
    // // doc.text(JSON.stringify(record.unit_price), 10, 10);
    // // doc.text(JSON.stringify(record.vendor_email), 10, 10);
    // // doc.text(JSON.stringify(record.vendor_name), 10, 10);

    // Open document in new tab
    var string = doc.output('datauristring');
    var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
    var x = window.open();
    x.document.open();
    x.document.write(embed);
    x.document.close();
    
  }

  const cancel = () => {
    setEditingKey('');
  };
  
  // Save new record
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      console.log("NewDate", newData);
      // find the index of the modified value
      const index = newData.findIndex((item) => key === item.key);
      // replace the properties with the new values
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      setData(newData)
      data.push(newData)
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'RM Code',
      dataIndex: 'key',
      width: '5%',
      editable: true,
      render: (key, row) => {
        
        return (
        <Tooltip title = {`Vendor: ${row.vendor_name}`}> {key}
        <InfoCircleOutlined />
        </Tooltip>
        )
      },
    },
    {
      title: 'Name and Description',
      dataIndex: 'name',
      width: '30',
      editable: true,
    },
    // {
    //   title: 'Order Quantity',
    //   dataIndex: 'vendor',
    //   width: '15%',
    //   editable: true,
    // },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      width: '15%',
      editable: true,
    },
    // {
    //   title: 'Unit',
    //   dataIndex: 'unit',
    //   width: '5%',
    //   editable: true,
    // },    
    {
      title: 'Coefficient',
      dataIndex: 'coefficient',
      width: '5%',
      editable: true,
    },
    {
      title: 'Total Price',
      dataIndex: 'total_price',
      width: '5%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
                color: "dodgerblue"
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel} okText="Yes" cancelText="No">
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} style={{color: "dodgerblue"}}>
            Edit
          </Typography.Link>
          <Typography.Link disabled={editingKey !== ''} onClick={() => newPdf(record)} style={{color: "dodgerblue"}}>
            Generate PDF
          </Typography.Link>
          </>
);
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  console.log(data)
  return (
    
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false} 
      />
      
    </Form>
    
  );
};

