import 'svelte-material-ui/bare.css';
//import './override-variables.css';
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {}
});

export default app;