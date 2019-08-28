<template>
  <div id="app">
    <div id="header">
      <router-link to="/home"><h1>{{ name }}</h1></router-link>
      <div>
        <span><router-link to="/new">New</router-link></span>
        <span><router-link to="/public">Boards</router-link></span>
      </div>
    </div>
    <div id="content">
      <router-view/>
    </div>
    <div id="footer"><center>
      <router-link to="/faq">FAQ</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/privacy">Privacy Policy</router-link> |
      <router-link to="/source">Source Code</router-link> |
      <router-link to="/content">Content Policy</router-link>
    </center></div>
  </div>
</template>

<script>
import { serviceName, apiUrl } from './constants';
import { api } from './utils';

document.title = serviceName;

export default {
  name: 'App',
  data() {
    return {
      name: serviceName,
    }
  }
}
</script>

<style>
body {
  margin: 0px;
  background: rgb(29, 29, 29);
  color: white;
  font-family: Arial, Helvetica, sans-serif;
}
a {
  color: rgb(255, 174, 0);
}
h1 {
	font-size: 40px;
}
select {
  background: rgb(20, 20, 20);
  border: 2px solid rgb(70, 70, 70);
  padding: 3px;
  color: white;
}
button, input[type="submit"] {
  background: rgb(20, 20, 20);
  border: 2px solid rgb(70, 70, 70);
  padding: 3px;
  color: white;
}
hr {
  border: 1px solid white;
}
textarea, input[type="text"], input[type="password"] {
	background: rgb(20, 20, 20);
	border: 2px solid rgb(70, 70, 70);
	color: white;
	padding: 5px;
}
textarea {
  width: calc(80vw - 25px);
}
table {
	border-collapse: collapse;
}
td, th {
	border: 1px solid gray;
}

.para {
  margin-left: 10vw;
	margin-right: 10vw;
}
.item {
	padding: 25px;
	background: rgb(20, 20, 20);
	display: inline-block;
	max-width: 350px;
	margin: 20px;
    box-shadow: 0px 3px 10px black;
}
.item div {
	text-align: left;
}
.error, .success {
	padding: 20px;
	display: inline-block;
	box-shadow: 0px 0px 10px black;
	font-weight: bold;
}
.error a, .success a {
	color: white;
}
.error {
	background: red;
}
.success {
	background: green;
}
.sticky {
	filter: invert(100%);
}

#content {
  position: relative;
  margin-top: 150px;
  margin-bottom: 100px;
  min-height: calc(100vh - 276px);
}

#header {
  z-index: 100;
  width: calc(100% - 10px);
  height: 80px;
  position: fixed;
  top: 0px;
  left: 0px;
  margin: 0px;
  padding: 5px;
  background: rgb(20, 20, 20);
  box-shadow: 0px 10px 30px black;
}
#header a h1 {
  color: white;
  padding-left: 10px;
  border-left: 4px solid white;
  position: relative;
  bottom: 10px;
}
#header span a {
  margin-top: 15px;
  margin-right: 15px;
  color: white;
  padding: 10px;
  font-size: 20px;
  background: rgb(37, 37, 37);
  text-decoration: none;
}
#header * {
  display: inline-block;
}
#header div {
  float: right;
}

#footer {
  padding: 5px;
  background: rgb(20, 20, 20);
  font-size: 14px;
}
</style>
