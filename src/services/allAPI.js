import commonAPI from "./commonAPI";
import { serverURL } from "./serverUrl";


export const addItemAPI = (data) => {
  return commonAPI("POST", `${serverURL}/items`, data);
};

export const getItemsAPI = () => {
  return commonAPI("GET", `${serverURL}/items`);
};

export const deleteItemAPI = (id) => {
  return commonAPI("DELETE", `${serverURL}/items/${id}`);
};


export const addCustomerAPI = (data) => {
  return commonAPI("POST", `${serverURL}/customers`, data);
};

export const getCustomersAPI = () => {
  return commonAPI("GET", `${serverURL}/customers`);
};

export const deleteCustomerAPI = (id) => {
  return commonAPI("DELETE", `${serverURL}/customers/${id}`);
};


export const createInvoiceAPI = (data) => {
  return commonAPI("POST", `${serverURL}/invoices`, data);
};

export const getInvoicesAPI = () => {
  return commonAPI("GET", `${serverURL}/invoices`);
};

export const getInvoiceByIdAPI = (id) => {
  return commonAPI("GET", `${serverURL}/invoices/${id}`);
};

export const deleteInvoiceAPI = (id) => {
  return commonAPI("DELETE", `${serverURL}/invoices/${id}`);
};

