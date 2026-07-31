"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


export default function AdminDashboard(){


const [students,setStudents] =
useState<any[]>([]);


const [lessons,setLessons] =
useState<any[]>([]);




useEffect(()=>{

loadData();

},[]);






async function loadData(){


const studentRes =
await fetch(
"http://localhost:3002/students"
);


const studentData =
await studentRes.json();


setStudents(studentData);





let allLessons:any[] = [];


for(const student of studentData){


const lessonRes =
await fetch(

`http://localhost:3002/lessons/student/${student.studentId}`

);


const lessonData =
await lessonRes.json();


if(Array.isArray(lessonData)){

allLessons =
[
...allLessons,
...lessonData
];

}


}


setLessons(allLessons);


}





const totalRevenue =
students.reduce(

(sum,student)=>

sum +
Number(student.packagePrice || 0),

0

);




const totalHours =
lessons.reduce(

(sum,lesson)=>

sum +
Number(lesson.hours || 0),

0

);






return (


<main className="min-h-screen bg-slate-900 p-10">


<div className="max-w-6xl mx-auto">





<h1 className="text-4xl font-bold text-white mb-2">

📊 Tutor Management Dashboard

</h1>


<p className="text-slate-400 mb-10">

Overview of your language academy

</p>








<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">





<Card

title="Students"

value={students.length}

color="text-blue-400"

/>





<Card

title="Lessons"

value={lessons.length}

color="text-purple-400"

/>





<Card

title="Teaching Hours"

value={`${totalHours} hrs`}

color="text-green-400"

/>





<Card

title="Revenue"

value={`${totalRevenue.toLocaleString()} THB`}

color="text-yellow-400"

/>




</div>








<div className="bg-slate-800 rounded-2xl p-6">


<h2 className="text-2xl font-bold text-white mb-6">

Quick Actions

</h2>






<div className="grid md:grid-cols-3 gap-4">





<Link

href="/admin/students/register"

className="
bg-green-600
hover:bg-green-700
text-white
font-bold
p-5
rounded-xl
text-center
"

>

➕ Register Student

</Link>






<Link

href="/admin/students"

className="
bg-blue-600
hover:bg-blue-700
text-white
font-bold
p-5
rounded-xl
text-center
"

>

👨‍🎓 Manage Students

</Link>






<Link

href="/admin/lessons"

className="
bg-purple-600
hover:bg-purple-700
text-white
font-bold
p-5
rounded-xl
text-center
"

>

📚 Manage Lessons

</Link>




</div>



</div>






</div>


</main>


);


}







function Card({

title,

value,

color,

}:any){


return (

<div className="
bg-slate-800
rounded-2xl
p-6
">


<p className="text-slate-400">

{title}

</p>



<h3 className={`text-3xl font-bold mt-2 ${color}`}>

{value}

</h3>



</div>

);


}