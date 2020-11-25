import React from "react";
import AuthService from "../services/auth.service";
import BoardAdmin from "../components/admin/board-admin.component";
//import BoardSysAdmin from "../components/admin/board-sysadmin.component";
import BoardOp from "../components/admin/board-op.component";
import BoardGym from "../components/admin/board-gym.component";
import BoardPersonal from "../components/admin/board-personal.component";
import BoardCustomer from "../components/admin/board-customer.component";

const Dashboard = () => {
  return (
    <>
      {AuthService.getCurrentRole() === "B_ADMIN" && (<BoardAdmin/>)}
      {AuthService.getCurrentRole() === "SYS_ADMIN" && (<BoardAdmin/>)}
      {AuthService.getCurrentRole() === "OPERATIONAL" && (<BoardOp/>)}
      {AuthService.getCurrentRole() === "GYM" && (<BoardGym/>)}
      {AuthService.getCurrentRole() === "PERSONAL" && (<BoardPersonal/>)}
      {AuthService.getCurrentRole() === "CUSTOMER" && (<BoardCustomer/>)}
      
    </>
  );
}

export default Dashboard;
