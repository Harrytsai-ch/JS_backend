const orderPageTableBody = document.querySelector('.orderPage-table tbody');
const orderPageTable = document.querySelector('.orderPage-table');
const discardAllBtn = document.querySelector('.discardAllBtn');
// console.log(discardAllBtn);

// console.log(orderPageTable);
const headers = {
    headers:{
        authorization:token
    }
};

async function getOrders(){
    try{
        const res = await axios.get(baseUrl + backApiUrl, headers);
        renderOrderTable(res.data.orders);
        renderChart(res.data.orders);
        console.log(res.data.orders);
    }catch(error){
        console.log(error.message);
    }
};

async function deleteOrder(id){
    try{
        const res = await axios.delete(baseUrl + backApiUrl + `/${id}` , headers);
        renderOrderTable(res.data.orders);
        renderChart(res.data.orders);
    }catch(error){
        console.log(error.message);
    }
}

//刪除全部訂單
async function deleteAllOrder(){
    try{
        const res = await axios.delete(baseUrl + backApiUrl, headers);
        renderOrderTable(res.data.orders);
        renderChart(res.data.orders);
    }catch(error){
        console.log(error.message);
    }
} 

//修改訂單
async function modifyOrder(id,paidStatus){
    modifyItem = {
        data: {
          id,
          paid: paidStatus
        }
    }
    try{
        const res = await axios.put(baseUrl + backApiUrl, modifyItem, headers);
        renderOrderTable(res.data.orders);
    }catch(error){
        console.log(error.message);
    }
}

function orderTableHtml(item){
    productsHtml = item["products"].map(product => `<p>${product.title} * ${product.quantity}</p>`).join('');
    return ` <tr data-id=${item.id}>
              <td>${item.id}</td>
              <td>
                <p>${item.user.name}</p>
                <p>${item.user.tel}</p>
              </td>
              <td>${item.user.address}</td>
              <td>${item.user.email}</td>
              <td >
                ${productsHtml}
              </td>
              <td>${formatTime(item.createdAt)}</td>
              <td class="orderStatus">
                <a href="#" style="color:${item.paid===false ? "red":"blue"}" data-paid=${item.paid}>${item.paid===false ? "未處理":"已處理"}</a>
              </td>
              <td>
                <input type="button" class="delSingleOrder-Btn" value="刪除" />
              </td>
            </tr>`
}

function renderOrderTable(data){
    orderPageTableBody.innerHTML = data.map(item =>orderTableHtml(item)).join('');
}

// TA-->products:Qty
function renderChart(data){
    productSummary = {};
    for(let order of data){
        for(let product of order.products){
            if(!productSummary[product['title']]){
                productSummary[product['title']] = product['quantity'] * product['price'];
            }else{
                productSummary[product['title']] += product['quantity'] * product['price'];
            }
        }
    }
    console.log(productSummary);
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: Object.entries(productSummary),
            colors:{
                "Louvre 雙人床架":"#DACBFF",
                "Antony 雙人床架":"#9D7FEA",
                "Anty 雙人床架": "#5434A7",
                "其他": "#301E5F",
            }
        },
    });
}

function formatTime(timestamp){
    const time = new Date(timestamp * 1000);
    return time.toLocaleString('zh-TW',{
        hour12:false
    })
}

function init(){
    getOrders();
}
init();


orderPageTableBody.addEventListener('click',(e)=>{
    if(e.target.getAttribute('value')==='刪除'){
        deleteOrder(e.target.closest('tr').getAttribute('data-id'));
    }

    if(e.target.closest('td').classList.contains('orderStatus') && e.target.nodeName ==='A'){
        e.preventDefault();
        if(e.target.getAttribute('data-paid') === 'false'){
            modifyOrder(e.target.closest('tr').getAttribute('data-id'), true);
            //不能在這裡處理HTML的顏色及內容，會產生顏色及內容先顯示，後面才出現push的結果，這樣的時間差會有不同步的問題
        }else{
            modifyOrder(e.target.closest('tr').getAttribute('data-id'), false);
        }  
    }
})


discardAllBtn.addEventListener('click',()=>{
    deleteAllOrder();
})




