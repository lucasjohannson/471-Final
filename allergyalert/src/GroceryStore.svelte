<script lang="ts">
    import { Avatar } from '@specialdoom/proi-ui';

    import {groceryCart, userName, userAllergies, viewName} from "./stores";
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    //import FaShoppingCart from 'svelte-icons/fa/FaShoppingCart.svelte'
    import Button, { Label } from '@smui/button';
    import Dialog, {Title, Content, Actions} from '@smui/dialog';
    import { allergies } from "./fakeData";
    import Drawer, { AppContent, Content as ContentD } from '@smui/drawer';
    import List, { Item, Text, Meta, Separator } from '@smui/list';
    import {foods as fakeFoods} from './fakeData';

    let foods= [];
    let groceryInventory = [];
    let total = 0;
    let currentFood={};
    let allergyDialogOpen = false;
    let knownAllergen;
    let chosenFood;
    let openRemoveItem = false;
    let indexToRemove = 0;

    $: {
        let newTotal = 0;
        for (let i in $groceryCart) {
            newTotal = newTotal + $groceryCart[i].price;
        }

        total = newTotal;
    }


    function checkForAllergy(food){
        currentFood = food;
        let myAllergy = food.allergens;
        for (let a in myAllergy){
            for (let b in $userAllergies){
                chosenFood = food.productName
                if ((myAllergy[a] == $userAllergies[b].allergyName) && ($userAllergies[b].hasAllergy)){
                    knownAllergen = $userAllergies[b].allergyName;
                    allergyDialogOpen = true;
                }
            }
        }
        if (allergyDialogOpen == false) {
            addToCart();
        }
    }

    function addToCart(){
        $groceryCart.push(currentFood);
        $groceryCart = $groceryCart;
    }

    async function getGroceries(){
        let response = await fetch('/api/store/products');
        try{
            foods = await response.json();
        } catch (error){
            foods = fakeFoods;
        }
    }

    function promptRemoveItem(idx) {
        indexToRemove = idx;
        openRemoveItem = true;
    }

    function removeFromCart(idx) {
        $groceryCart.splice(idx, 1);
        $groceryCart = $groceryCart;
    }

    

    getGroceries();
    
</script>
<div class="avatar">
    <Avatar
      title= {"Hello " + $userName + "!"}
      image="https://avatars.githubusercontent.com/u/41910815?v=4"
    />
  
    <div class="avatarButtonContainer">
        <Button on:click={ () => {$viewName = "profile"} } variant="raised">
          <Label>back to profile</Label>
        </Button>
    </div>
  </div>

<div class="banner">Allergy Alert Grocery Store</div>
<div class="drawer-container">
     
<AppContent class="app-content">

<Dialog
  bind:open={allergyDialogOpen}
  scrimClickAction=""
  escapeKeyAction=""
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
  <Title id="simple-title">Allergy Alert</Title>
  <Content id="simple-content">This item contains {knownAllergen}</Content>
  <Actions>
    <Button on:click={() =>{}}>
      <Label>Oops! Don't add to cart</Label>
    </Button>
    <Button on:click={() => addToCart()}>
      <Label>I understand, add to cart</Label>
    </Button>
  </Actions>
</Dialog>

<Dialog
  bind:open={openRemoveItem}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
  <Title id="simple-title">Remove {$groceryCart[indexToRemove]?.productName}?</Title>
  <Content id="simple-content">Would you like to remove {$groceryCart[indexToRemove]?.productName} from your cart?</Content>
  <Actions>
    <Button on:click={() =>{}}>
      <Label>Keep in cart</Label>
    </Button>
    <Button on:click={() => removeFromCart(indexToRemove)}>
      <Label>Remove from cart</Label>
    </Button>
  </Actions>
</Dialog>


<div class="grocery">
    {#each foods as food}
        <div class="picts">
            <img src= {food.productImage} alt={food.productName}/>
            <p>{food.productName}</p>
            <p>${food.price.toFixed(2)}</p>
            <div class="putInCartButton">
                <Button on:click={() => checkForAllergy(food)} variant="raised">
                    <Label>Add to Cart</Label>
                </Button>
            </div>
        </div>
    {/each}
</div>
</AppContent>

<Drawer>
    <ContentD>
      <List>
          <Text> Cart </Text>
          <Separator/>
          {#each $groceryCart as {productName, price}, i}
          <Item
              href="javascript:void(0)"
              on:click={() => promptRemoveItem(i)}>
          <Label>{productName}</Label>
          <Meta>
              <Text>${price.toFixed(2)}</Text>
          </Meta>
          </Item>
          {/each}

          <Separator/>
          <Item>
          <Text>Total:</Text>
          <Meta>
              <Text>{total.toFixed(2)}</Text>
          </Meta>
      </Item>
      </List>
  </ContentD>
</Drawer>

</div>
<style>
    .avatarButtonContainer{
        display: flex;
    }
    .grocery{
        display: flex;
        flex-direction: row;
    }
    .picts{
        margin: 20px;
    }
    .picts img{
        max-width: 160px;
        max-height: 160px;
        width: auto;
        height: auto;
    }
    
    .banner{
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--mdc-theme-secondary, #1d741b);
        color: var(--mdc-theme-on-secondary, #e9eae0);
    }


    /* These classes are only needed because the
    drawer is in a container on the page. */
  .drawer-container {
    position: relative ;
    display: flex;
    height: 100%;
    width: 100%;
    /*max-height: 100%;
    max-width: 600px;*/
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    overflow: hidden;
    z-index: 0;
  }
  * :global(.app-content) {
    flex: auto;
    overflow: auto;
    position: relative;
    flex-grow: 1;
  }

</style>