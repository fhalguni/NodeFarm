const fs=require('fs');
const http=require('http');
const url=require('url');
const slugify=require('slugify');
//Server
const replaceTemplate=(temp,product)=>{
    let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output=output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%PRICE%}/g,product.price);
    output=output.replace(/{%FROM%}/g,product.from);
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output=output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%DESCRIPTION%}/g,product.description);
    output=output.replace(/{%ID%}/g,product.id);

    if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
}

const tempOverview=fs.readFileSync('./template-overview.html','utf-8');
const tempCard=fs.readFileSync('./template-card.html','utf-8');
const tempProduct=fs.readFileSync('./template-product.html','utf-8');

const data=fs.readFileSync('./data.json','utf-8');
const dataObj=JSON.parse(data);

const slugs=dataObj.map(el=>slugify(el.productName,{lower:true}));
console.log(slugs);
//console.log(slugify('Fresh Avocados',{lower:true}));

const server=http.createServer((req,res)=>{
    
    const {query, pathname}=url.parse(req.url,true);
    

//overview page
   
   if(pathname=='/' || pathname== '/overview'){
    res.writeHead(200,{'Content-type':'text/html'});
    const cardsHtml = dataObj.map(el=> replaceTemplate(tempCard,el)).join('');
    const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
    res.end(output);
   }

   //product page
   else if(pathname === '/product'){
    res.writeHead(200,{'Content-type':'text/html'});
    const product=dataObj[query.id];
    const output=replaceTemplate(tempProduct,product);
    res.end(output);
   }

   //api
   else if(pathname==='/api'){
    fs.readFile('./data.json','utf-8', (err,data)=>{
        const productData=JSON.parse(data);
        console.log(productData);
        res.end(data);
    });
    
   }
   //not found
   else{
    res.end('Page not found');
   }

})
server.listen(7200,()=>{
    console.log("Listening... on port no 7200");
});