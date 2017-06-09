// "受注残"セル
//  セルに入力された値より受注数をサマリ。在庫数を下回ったら赤字で表示する。
Vue.component('remainCell', {
	name: "remainCell",
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
	  		return "text-muted";
	  	}
	  }
	}
})

// inputcell: オーダー数入力
Vue.component('inputCell', {
	name: "inputCell",
	props: ["username", "itemname", "userlevel", "itemprice", "order"],
	data: function(){
		return { 
			orderQty: this.order
		 }
	},
  template: '<div><input type="number" min="0" v-model="orderQty"><button class="btn btn-sm btn-primary" v-on:click="onSave"><span class="glyphicon glyphicon-floppy-save" aria-hidden="true"></span></button></div>',
  methods: {
  	onSave: function(){
  		app.updateOrder(this.itemname, this.username, this.orderQty);
  	}
  }
})

// tr
Vue.component("vRow", {
	name: "vRow",
	props: ["item", "users"],
	template: '<tr>' +
					'<th>{{item.name}}</th>' + 
					'<th>{{item.stock}}</th>' + 
					'<th>{{itemOrderSummary(item.name)}}</th>' + 
					'<th><remainCell v-bind:itemstock="item.stock" v-bind:itemsum="itemOrderSummary(item.name)"></remainCell></th>' + 
					'<th v-for="user in users">' + 
					'<inputCell v-bind:username="user.name" v-bind:itemname="item.name" v-bind:userlevel="user.level" v-bind:itemprice="item.price" v-bind:order="user.orders[item.name]"></inputCell>' +
					'</th>' +
				'</tr>',
	methods: {
		itemOrderSummary: function(itemName){
			return this.users.map(function(user){ return user.orders[itemName] }).reduce(function(prev, current){ return parseInt(prev) + parseInt(current); });
		}
	}
})

// tbody
Vue.component("vBody", {
	name: "vBody",
	props: ["items", "users"],
	template: '<tbody>' +
		'<vRow v-for="item in items" :key="item.name" v-bind:item="item" v-bind:users="users"></vRow>' +
		'<tr>' +
			'<th></th>' +
			'<th></th>' +
			'<th></th>' +
			'<th></th>' +
			'<th v-for="user in users">' +
				'{{ userOrderSummary(user.name) }}' +
			'</th>' +
		'</tr>' +
		'</tbody>',
	methods: {
		itemList: function(){
  		return this.items.map(function(r){ return r.name; });
  	},
		getUser: function(userName){
  		return this.users.find(function(r){ if(r.name===userName) return true });
  	},
		userOrderSummary: function(userName){
			user = this.getUser(userName);
  		itemlist = this.itemList();
  		count = 0;
  		for(var i=0; i < this.itemList().length; i++){
  			count += parseInt(user.orders[itemlist[i]]);
  		}
  		return count;
		}
	}
})

// テーブル
Vue.component("vtable", {
	name: "vtable",
	props: ["items", "users"],
	template: '<table class="table table-bordered">' +
			  '<thead>' +
					'<tr>' + 
						'<th>品目</th>' + 
						'<th>在庫</th>' + 
						'<th>受注</th>' +
						'<th>残数</th>' +
						'<th v-for="user in users">{{user.name}}</th>' +
					'</tr>' +
				'</thead>' + 
				'<vBody v-bind:items="items" v-bind:users="users"></vBody>' +
			'</table>'
})

// ルートコンポーネント
var app = new Vue({
  el: '#app',
  name: "app",
  data: {
    message: 'Crosstab by Vue.js',
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
  	updateOrder: function(itemName, userName, qty){
  		user = this.getUser(userName);
  		user.orders[itemName] = qty;
  		now = new Date();
  		log = [{
						updated_at: now,
						itemName: itemName,
						userName: userName,
						qty: qty
					}];
  		this.console += JSON.stringify(log) + "\r\n";
  	},
  	getUser: function(userName){
  		return this.users.find(function(r){ if(r.name===userName) return true });
  	}
  }
})