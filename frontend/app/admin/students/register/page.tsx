"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function RegisterStudentPage(){


const router = useRouter();



const [form,setForm] =
useState({

fullName:"",
certificateName:"",
email:"",
phone:"",
languages:"",
packageHours:"",
packagePrice:""

});





function handleChange(
e:any
){

setForm({

...form,

[e.target.name]:
e.target.value

});

}







async function registerStudent(){


if(
!form.fullName ||
!form.packageHours ||
!form.packagePrice
){

alert(
"Please fill required fields"
);

return;

}





const res =
await fetch(

"http://localhost:3002/students/register",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify(form)


}

);




const data =
await res.json();



alert(
`Student created: ${data.studentId}`
);



router.push(
"/admin/students"
);



}









return (


<main className="min-h-screen bg-slate-900 p-10">


<div className="max-w-xl mx-auto">





<h1 className="text-4xl font-bold text-white mb-8">

➕ Register Student

</h1>







<div className="bg-slate-800 rounded-2xl p-6 space-y-4">





<input

name="fullName"

placeholder="Full Name *"

value={form.fullName}

onChange={handleChange}

className="
w-full
bg-slate-700
text-white
p-3
rounded-lg
"

/>







<input

name="certificateName"

placeholder="Certificate Name"

value={form.certificateName}

onChange={handleChange}

className="
w-full
bg-slate-700
text-white
p-3
rounded-lg
"

/>







<input

name="email"

placeholder="Email"

value={form.email}

onChange={handleChange}

className="
w-full
bg-slate-700
text-white
p-3
rounded-lg
"

/>








<input

name="phone"

placeholder="Phone"

value={form.phone}

onChange={handleChange}

className="
w-full
bg-slate-700
text-white
p-3
rounded-lg
"

/>








<input

name="languages"

placeholder="Languages"

value={form.languages}

onChange={handleChange}

className="
w-full
bg-slate-700
text-white
p-3
rounded-lg
"

/>








<input

name="packageHours"

type="number"

placeholder="Package Hours *"

value={form.packageHours}

onChange={handleChange}

className="
w-full
bg-slate-700
text-white
p-3
rounded-lg
"

/>








<input

name="packagePrice"

type="number"

placeholder="Package Price THB *"

value={form.packagePrice}

onChange={handleChange}

className="
w-full
bg-slate-700
text-white
p-3
rounded-lg
"

/>








<button

onClick={registerStudent}

className="
w-full
bg-green-600
hover:bg-green-700
text-white
font-bold
p-3
rounded-lg
"

>

Register Student

</button>






</div>




</div>


</main>


);


}