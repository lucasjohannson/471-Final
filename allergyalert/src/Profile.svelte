<script lang="ts">
    import { Avatar } from '@specialdoom/proi-ui';
    import { userName, viewName, userAllergies, userFirstName, userLastName, userAddress } from './stores';
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Checkbox from '@smui/checkbox';
    import FormField from '@smui/form-field';
    import Button, { Label } from '@smui/button';
    import IoIosCard from 'svelte-icons/io/IoIosCard.svelte' 
    import MdEdit from 'svelte-icons/md/MdModeEdit.svelte'
///////////////////////////////
    import { allergies as fakeAllergies} from './fakeData';
//////////////////////////////
    function toggle(){
        $viewName = "grocery"
    }

    
    let selected = [];

async function getProfile(){
  let response = await fetch('/api/user/' +$userName + '/profile');
  let profile = await response.json();
  $userFirstName = profile.firstName;
  $userLastName = profile.lastName;
  $userAddress = profile.address;
}

//fetch allergies from server
async function getAllergies(){
  let response = await fetch('/api/user/' + $userName + '/allergies');
  
  try {
    $userAllergies = await response.json();  
  } catch (error) {
    $userAllergies = fakeAllergies;
  }
  
  for (let i in $userAllergies){
    if ($userAllergies[i].hasAllergy){
      selected.push($userAllergies[i].allergyName);
      selected = selected;
    }
  }
}

async function postAllergies(){
  let response = await fetch('api/user/' + $userName +'/allergies', {
    method:'POST', 
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(selected)});
  
}

getProfile();
getAllergies();


</script>



<div class="avatar">
  <Avatar
    title= {"Hello " + $userName + "!"}
    image="https://avatars.githubusercontent.com/u/41910815?v=4"
  />

  <div class="shopButtonContainer">
      <Button on:click={ toggle } variant="raised">
        <Label>start shopping</Label>
      </Button>
  </div>
</div>

<div>

    <LayoutGrid>

          <Cell span={10}>
              <div class="banner">{$userName}'s Profile 
                <div class="iconEdit">
                <MdEdit/></div>
            </div>
          </Cell>

          <Cell span={4}>
             <div class="demo-cell">First Name: {$userFirstName}</div>
             <div class="demo-cell">Last Name: {$userLastName}</div>
             <div class="demo-cell">Address: {$userAddress}</div>
             <div class="demo-cell allergies">
                 <div class="allergyselect">Food Allergies: 
                 </div>
                {#each $userAllergies as option}
                <div class="allergyselect">
                <FormField>

                    <Checkbox
                        bind:group={selected}
                        value={option.allergyName}/>
                    <span slot="label">{option.allergyName}</span>
                </FormField>
                </div>
                 {/each}

                 <div class="editAllergies">
                  <Button on:click={ postAllergies } variant="raised">
                    <Label>Edit</Label>
                  </Button>
              </div>

             </div>
          </Cell>
          
          <Cell span={4}>
             <div class="demo-cell">
                <div class="iconCard"> 
                <IoIosCard/> </div>
                Payment Options: VISA ending in -1234 </div>
          </Cell>

  </LayoutGrid>

</div>

<style>
    .iconCard{
        color: darkblue;
        width: 30px;
        height: 30px;
    }
    .iconEdit {
        color:cornsilk;
        width:20px;
        height: 20px;
    }
    .shopButtonContainer{
        display: flex;
    }
    .allergyselect{
        align-self: flex-start;
    }
    .allergies{
        flex-direction: column;
    }

    .banner{
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--mdc-theme-secondary, #1d741b);
        color: var(--mdc-theme-on-secondary, cornsilk);
    }

  .demo-cell {
    height: 60px;
    display: flex;
    justify-content: left;
    align-items: center;
    background-color: var(--mdc-theme-secondary, #fff);
    color: var(--mdc-theme-on-secondary, #333);
  }
</style>