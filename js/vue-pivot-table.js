// "受注残"セル
//  セルに入力された値より受注数をサマリ。在庫数を下回ったら赤字で表示する。
Vue.component('stockremaincell', {
	name: "stockremaincell",
  props: ["itemstock", "itemsum"],
	template: '<p v-bind:class="cellStyle">{{ this.itemOrderRemain() }}</p>',
	methods: {
		itemOrderRemain: function(){
      return parseInt(this.itemstock) - parseInt(this.itemsum);
  	}
	},
	computed: {
	  cellStyle: function () {
	  	remain = this.itemOrderRemain();
	  	if(remain > 0){
	  		return "text-primary";
	  	}
	  	else if(remain < 0){
	  		return "text-danger";
	  	}
	  	else{
	  		return "";
	  	}
	  }
	}
})

// オーダー数入力セル
Vue.component('cell', {
	name: "cell",
	props: ["username", "itemname", "userlevel", "itemprice", "order"],
	data: function(){
		return { 
			orderQty: this.order
		 }
	},
  template: '<div><input type="text" size="3" v-model="orderQty"><button class="btn btn-sm btn-primary" v-on:click="onSave"><span class="glyphicon glyphicon-floppy-save" aria-hidden="true"></span></button></div>',
  methods: {
  	onSave: function(){
  		app.updateOrder(this.itemname, this.username, this.orderQty);
  	}
  }
})

// ルートコンポーネント
var app = new Vue({
  el: '#app',
  name: "app",
  data: {
    message: 'Vue.jsでピボットテーブル',
    users: [
    	{name: "yuto", level: 1, orders: {
	    		item1: 1,
	    		item2: 3,
	    		item3: 1,
	    		item4: 0,
	    		item5: 0,
	    		item6: 1
	    	}
	    },
    	{name: "asano", level: 2, orders: {
	    		item1: 1,
	    		item2: 0,
	    		item3: 0,
	    		item4: 0,
	    		item5: 4,
	    		item6: 0
	    	}
	    },
    	{name: "yano", level: 3, orders: {
	    		item1: 1,
	    		item2: 0,
	    		item3: 1,
	    		item4: 1,
	    		item5: 1,
	    		item6: 1
	    	}
	    },
    	{name: "yuji", level: 4, orders: {
	    		item1: 2,
	    		item2: 0,
	    		item3: 0,
	    		item4: 1,
	    		item5: 0,
	    		item6: 3
	    	}
	    },
    	{name: "hose", level: 5, orders: {
	    		item1: 0,
	    		item2: 0,
	    		item3: 1,
	    		item4: 0,
	    		item5: 0,
	    		item6: 0
	    	}
	    },
    	{name: "masaki", level: 6, orders: {
	    		item1: 0,
	    		item2: 2,
	    		item3: 20,
	    		item4: 0,
	    		item5: 0,
	    		item6: 0
	    	}
	    },
    ],
    items: [
    	{name: "item1", stock: 10, price: 12000},
    	{name: "item2", stock: 5, price: 3900},
    	{name: "item3", stock: 20, price: 9800},
    	{name: "item4", stock: 4, price: 56000},
    	{name: "item5", stock: 12, price: 52000},
    	{name: "item6", stock: 10, price: 32000},
    ],
    console: ""
  },
  methods: {
  	itemList: function(){
  		return this.items.map(function(r){ return r.name; });
  	},
  	itemOrderSummary: function(itemName){
  		return this.users.map(function(user){ return user.orders[itemName] }).reduce(function(prev, current){ return parseInt(prev) + parseInt(current); });
  	},
  	userOrderSummary: function(username){
  		user = this.getUser(username);
  		itemlist = this.itemList();
  		count = 0;
  		for(var i=0; i < this.itemList().length; i++){
  			count += parseInt(user.orders[itemlist[i]]);
  		}

  		return count;
  	},
  	updateOrder: function(item, user, qty){
  		user = this.getUser(user);
  		user.orders[item] = qty;

  		now = new Date();
  		log = [{
  		  			updated_at: now,
  		  			item: item,
  		  			user: user,
  		  			qty: qty
  		  		}];
  		this.console += JSON.stringify(log) + "\r\n";
  	},
  	getUser: function(username){
  		return this.users.find(function(r){ if(r.name===username) return true });
  	}
  }
})