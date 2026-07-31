"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


export default function LessonsPage() {


  const searchParams = useSearchParams();

  const studentIdFromUrl =
    searchParams.get("studentId");



  const [students,setStudents] = useState<any[]>([]);

  const [studentId,setStudentId] = useState("");

  const [lessons,setLessons] = useState<any[]>([]);



  const [title,setTitle] = useState("");

  const [teacher,setTeacher] = useState("");

  const [hours,setHours] = useState("");



  const [editId,setEditId] = useState<number | null>(null);





  useEffect(()=>{


    fetch("http://localhost:3002/students")

    .then(res=>res.json())

    .then(data=>{


      setStudents(data);



      if(studentIdFromUrl){

        setStudentId(studentIdFromUrl);

        loadLessons(studentIdFromUrl);

      }


    });



  },[studentIdFromUrl]);







  async function loadLessons(id:string){


    if(!id) return;


    const res = await fetch(
      `http://localhost:3002/lessons/student/${id}`
    );


    const data = await res.json();


    setLessons(
      Array.isArray(data)
      ? data
      : []
    );


  }







  async function saveLesson(){


    if(!studentId || !title || !teacher || !hours){

      alert("Please fill all fields");

      return;

    }



    const url = editId

      ? `http://localhost:3002/lessons/${editId}`

      : "http://localhost:3002/lessons";



    await fetch(
      url,
      {

        method: editId ? "PUT" : "POST",

        headers:{
          "Content-Type":"application/json",
        },


        body:JSON.stringify({

          title,

          teacher,

          hours:Number(hours),

          studentId,

        }),

      }
    );



    clearForm();


    loadLessons(studentId);


  }







  function editLesson(lesson:any){


    setEditId(lesson.id);

    setTitle(lesson.title);

    setTeacher(lesson.teacher);

    setHours(String(lesson.hours));


  }







  function clearForm(){

    setTitle("");

    setTeacher("");

    setHours("");

    setEditId(null);

  }







  async function deleteLesson(id:number){


    const ok = confirm(
      "Delete this lesson?"
    );


    if(!ok) return;



    await fetch(

      `http://localhost:3002/lessons/${id}`,

      {
        method:"DELETE",
      }

    );



    loadLessons(studentId);


  }







  const selectedStudent =
    students.find(
      student =>
      student.studentId === studentId
    );







return (

<main className="min-h-screen bg-slate-900 p-10">


<div className="max-w-5xl mx-auto">



<h1 className="text-4xl font-bold text-white mb-2">

📚 Lesson Management

</h1>


<p className="text-slate-400 mb-8">

Manage student's learning history

</p>







<div className="bg-slate-800 rounded-2xl p-6 mb-8">


<h2 className="text-xl font-bold text-white mb-4">

👤 Student

</h2>



<div className="text-slate-300">


<p>

Name:

<span className="text-white font-bold">

{" "}
{selectedStudent?.fullName}

</span>

</p>



<p>

Student ID:

<span className="text-blue-400 font-bold">

{" "}
{selectedStudent?.studentId}

</span>

</p>



</div>


</div>









<div className="bg-slate-800 rounded-2xl p-6 mb-8">


<h2 className="text-xl font-bold text-white mb-5">

{editId ? "✏️ Edit Lesson" : "➕ Add New Lesson"}

</h2>





<div className="grid gap-4">



<input

placeholder="Lesson title"

value={title}

onChange={
e=>setTitle(e.target.value)
}

className="bg-slate-700 text-white p-3 rounded-lg"

/>





<input

placeholder="Teacher"

value={teacher}

onChange={
e=>setTeacher(e.target.value)
}

className="bg-slate-700 text-white p-3 rounded-lg"

/>





<input

placeholder="Hours"

type="number"

value={hours}

onChange={
e=>setHours(e.target.value)
}

className="bg-slate-700 text-white p-3 rounded-lg"

/>







<button

onClick={saveLesson}

className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg"

>

{
editId
? "Save Changes"
: "Add Lesson"
}

</button>





{
editId &&

<button

onClick={clearForm}

className="bg-gray-600 text-white font-bold p-3 rounded-lg"

>

Cancel

</button>

}



</div>


</div>









<div className="bg-slate-800 rounded-2xl p-6">



<div className="flex justify-between mb-5">


<h2 className="text-xl font-bold text-white">

📖 Lesson History ({lessons.length})

</h2>



<button

onClick={()=>loadLessons(studentId)}

className="bg-green-600 px-4 py-2 rounded-lg text-white"

>

Refresh

</button>



</div>







{
lessons.length===0

?

<p className="text-slate-400">

No lessons found

</p>


:


<div className="grid gap-4">



{
lessons.map((lesson)=>(


<div

key={lesson.id}

className="bg-slate-700 rounded-xl p-5 border border-slate-600"

>



<div className="flex justify-between items-center">


<h3 className="text-xl font-bold text-white">

{lesson.title}

</h3>



<div className="flex gap-2">



<button

onClick={()=>editLesson(lesson)}

className="bg-yellow-500 px-4 py-2 rounded-lg text-white"

>

Edit

</button>





<button

onClick={()=>deleteLesson(lesson.id)}

className="bg-red-600 px-4 py-2 rounded-lg text-white"

>

Delete

</button>



</div>


</div>






<p className="text-slate-300 mt-3">

👨‍🏫 {lesson.teacher}

</p>



<p className="text-slate-300">

⏱ {lesson.hours} Hours

</p>




<p className="text-slate-400 text-sm mt-2">

📅 {

lesson.date

?

new Date(
lesson.date
).toLocaleDateString(
"en-GB"
)

:

"-"

}

</p>




</div>


))

}



</div>


}



</div>






</div>

</main>


);


}