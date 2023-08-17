** 👉 HOW TO CONFIGURE THE SYSTEM 

<span style="margin-left: 5px;   padding-left:10px; 
 border-left-style:solid;
 border-left-color: red;
 border-radius: 20px;
 font-weight:bold;
">
Step 1

</span>

<div 
    style="
        background-color : black;
        padding: 10px;
        border-radius :5px;
        margin: 5px;
        color: white;  
    "
> 
docker build -t web-gateway:1.0 . </div>

<span style="margin-left: 5px; padding-left:10px; 
 border-left-style:solid;
 border-left-color: red;
 border-radius: 20px;
 font-weight: bold;
">
Step 2
</span>

<div 
    style="
        background-color : black;
        padding: 10px;
        border-radius :5px;
        margin: 5px;
        color: white;
    "
> docker login -u repo_name -p account_pass </div>

<span style="margin-left: 5px; padding-left:10px; 
 border-left-style:solid;
 border-left-color: red;
 border-radius: 20px;
 font-weight: bold;
">
Step 3
</span>

<div 
    style="
        background-color : black;
        padding: 10px;
        border-radius :5px;
        margin: 5px;
        color: white;
    "
> docker push web-gateway:1.0 </div>