import Vue from 'vue'
import Router from 'vue-router'

import { serviceName } from '../constants'

const Home = () => import('@/components/Home')
const NotFound = () => import('@/components/NotFound')
const Faq = () => import('@/components/Faq')
const About = () => import('@/components/About')
const Source = () => import('@/components/Source')
const PublicPosts = () => import('@/components/PublicPosts')
const New = () => import('@/components/New')
const ViewPost = () => import('@/components/ViewPost')
const ContentPolicy = () => import('@/components/ContentPolicy')
const PrivacyPolicy = () => import('@/components/PrivacyPolicy')
const Mod = () => import('@/components/Mod')
const Login = () => import('@/components/Login')
const EditBoard = () => import('@/components/EditBoard')

Vue.use(Router)

var router = new Router({
  mode: "history",
  routes: [
    { path: '*', name: 'NotFound', component: NotFound },
    { path: '/', name: 'Home', component: Home },
    { path: '/home', name: 'Home', component: Home },
    { path: '/faq', name: "FAQ", component: Faq },
    { path: '/about', name: 'About', component: About },
    { path: '/source', name: 'Source', component: Source },
    { path: '/public', name: 'PublicPosts', component: PublicPosts },
    { path: '/public/:category(.|..|...|....)', nane: 'CategoryPosts', component: PublicPosts },
    { path: '/new', name: 'New', component: New },
    { path: '/:category(.|..|...|....)/new', name: 'CategoryNew', component: New },
    { path: '/(.|..|...|....)/:id(..........)', name: 'ViewCategoryPost', component: ViewPost },
    { path: '/view/:id', name: 'ViewPost', component: ViewPost },
    { path: '/content', name: 'ContentPolicy', component: ContentPolicy },
    { path: '/privacy', name: 'PrivacyPolicy', component: PrivacyPolicy },
    { path: '/mod', name: 'ModPanel', component: Mod },
    { path: '/mod/board/:id', name: 'EditBoard', component: EditBoard },
    { path: '/login', name: 'Login', component: Login },
    { path: '/:category(.|..|...|....)', name: "CategoryPosts", component: PublicPosts }
  ]
})
router.beforeEach((to, from, next) => {
	document.title = serviceName;
	next();
});
export default router
