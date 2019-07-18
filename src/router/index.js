import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('@/components/Home')
const NotFound = () => import('@/components/NotFound')
const About = () => import('@/components/About')
const Source = () => import('@/components/Source')
const PublicPosts = () => import('@/components/PublicPosts')
const New = () => import('@/components/New')
const ViewPost = () => import('@/components/ViewPost')
const ContentPolicy = () => import('@/components/ContentPolicy')
const PrivacyPolicy = () => import('@/components/PrivacyPolicy')

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    { path: '*', name: 'NotFound', component: NotFound },
    { path: '/', name: 'Home', component: Home },
    { path: '/home', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About },
    { path: '/source', name: 'Source', component: Source },
    { path: '/public', name: 'PublicPosts', component: PublicPosts },
    { path: '/new', name: 'New', component: New },
    { path: '/view/:id', name: 'ViewPost', component: ViewPost },
    { path: '/content', name: 'ContentPolicy', component: ContentPolicy },
    { path: '/privacy', name: 'PrivacyPolicy', component: PrivacyPolicy }
  ]
})
