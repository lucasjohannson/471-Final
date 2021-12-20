<script lang="ts">
    import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import { password, userName, viewName } from './stores';

	function toggle() {
		if ($userName){
			$viewName = "profile";
		}
	}
  
  //post login response to server
  async function postLogin(){
    let response = await fetch('/api/user/login',{    
    method:'POST',
    headers:{
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(
      {
      "username":$userName,
      "password":$password
    })
  });
  try{
    reply = await response.json();
    if (reply === true){
      toggle();
    }
    else{
      $userName = "";
      $password = "";
    }
  }
  catch(error){
    toggle();
  }
}

let reply;
</script>

	<p>Welcome to the Allergy Alert Grocery Store </p>
	<div>
		<Textfield bind:value={$userName} label="Username" placeholder="enter username" class="shaped-outlined" 
			variant="outlined"/>
	</div>
	<div>
		<Textfield label="Password" type="password" bind:value={$password} placeholder="enter password" class="shaped-outlined" 
			variant="outlined"/>
	</div>

	<Button on:click={ postLogin } variant="raised">
		<Label>Login</Label>
	</Button>

  {#if reply ===false}
    <div>Incorrect username or password</div>
  {/if}

	
<style>
	div {
		margin: 8px;
	}
	*
    :global(.shaped-outlined
      .mdc-notched-outline
      .mdc-notched-outline__leading) {
    border-radius: 28px 0 0 28px;
    width: 28px;
  }
  *
    :global(.shaped-outlined
      .mdc-notched-outline
      .mdc-notched-outline__trailing) {
    border-radius: 0 28px 28px 0;
  }
  * :global(.shaped-outlined .mdc-notched-outline .mdc-notched-outline__notch) {
    max-width: calc(100% - 28px * 2);
  }
  *
    :global(.shaped-outlined.mdc-text-field--with-leading-icon:not(.mdc-text-field--label-floating)
      .mdc-floating-label) {
    left: 16px;
  }
  * :global(.shaped-outlined + .mdc-text-field-helper-line) {
    padding-left: 32px;
    padding-right: 28px;
  }
</style>