const client = require("../db.js");
const path = require("path");
const session = require("express-session");

let facultyLoginGet = (req, res) => {
  res.render("facultyLogin");
};

let facultyLoginPost = async (req, res) => {
  let email_id = req.body.email_id;
  let password = req.body.password;
  console.log(email_id, password); //

  if (!(email_id && password)) return res.redirect("/faculty/login");

  let q = `select * from faculty where email = '${email_id}'`;
  client.query(q, (err, result) => {
    if (err) throw err;
    // if (result.length == 0) {
    //   return res.redirect("login");
    // }
    if (result["rows"].length == 0) {
      return res.redirect("login");
    }
    let _faculty = result["rows"][0];
    console.log(_faculty);
    req.session.loggedIn = true;
    req.session.userType = "faculty";
    req.session.ID = _faculty["facultyid"];
    req.session.name = _faculty["name"];
    req.session.email = _faculty["email"];
    res.redirect("index");
  });
  //     bcrypt.compare(password, result[0].facultyPassword).then((resu) => {
  //       if (resu) {
  //         req.session.loggedIn = true;
  //         req.session.userType = "faculty";
  //         req.session.user = result[0];
  //         res.redirect("/faculty/dashboard");
  //       } else {
  //         res.redirect("/faculty/login");
  //       }
  //     });
  //   });
};

let facultyIndexGet = async(req, res) => {
  let statusq =  `select * from constants`;
  let statusres = await client.query(statusq);
  let status = statusres['rows'][0]['status'];

  if (req.session.loggedIn && req.session.userType == "faculty") {
    let query = `select sc.semcourseid as "SemCourseId", 
        c.coursename as "Course", c.lecture as "L", c.tutorial as "T", 
        c.practical as "P", bs.sem as "Semester", b.branchname as "Branch"
        from sem_course as sc
        inner join branch_sem as bs using(branchsemid)
        inner join course as c using (courseid)
        inner join branch as b using (branchid)
        where bs.sem % 2 = 1
        order by bs.sem asc;`;

    let result = await client.query(query);
     try{
      let _courses = result["rows"];
      await res.render("facultyIndex", {
        user: req.session.name,
        courses: _courses,
        status: status,
      });
    }
    catch(err)
    {
      throw err;
    }
  } else {
    await res.redirect("login");
  }
};

let tempdata = [];

let facultyIndexPost = (req, res) => {
  if (req.session.loggedIn && req.session.userType == "faculty") {
    let s = `delete from preferences where facultyid = ${req.session.ID}; 
    insert into preferences values (${req.session.ID}`;
    for (let x in req.body) {
      let obj = JSON.parse(req.body[x]);
        s = s + `, ${obj["SemCourseId"]}`;
    }
    s = s + `);`;
    client.query(s, (err, result)=>{
        if (err) throw err;
        res.redirect("dashboard");
    });
  } else {
    res.redirect("login");
  }
};

let facultyDashboardGet = (req, res) => {
  if (req.session.loggedIn && req.session.userType == "faculty") {
    let q = `select fc.facultyid, fc.name, 
    sc1.semcourseid as "SemCourseID1", c1.coursename as "Course1", c1.lecture as "L1", c1.tutorial as "T1", c1.practical as "P1", b1.branchname as "Branch1", bs1.sem as "Sem1",
    sc2.semcourseid as "SemCourseID2", c2.coursename as "Course2", c2.lecture as "L2", c2.tutorial as "T2", c2.practical as "P2", b2.branchname as "Branch2", bs2.sem as "Sem2",
    sc3.semcourseid as "SemCourseID3", c3.coursename as "Course3", c3.lecture as "L3", c3.tutorial as "T3", c3.practical as "P3", b3.branchname as "Branch3", bs3.sem as "Sem3",
    sc4.semcourseid as "SemCourseID4", c4.coursename as "Course4", c4.lecture as "L4", c4.tutorial as "T4", c4.practical as "P4", b4.branchname as "Branch4", bs4.sem as "Sem4",
    sc5.semcourseid as "SemCourseID5", c5.coursename as "Course5", c5.lecture as "L5", c5.tutorial as "T5", c5.practical as "P5", b5.branchname as "Branch5", bs5.sem as "Sem5",
    sc6.semcourseid as "SemCourseID6", c6.coursename as "Course6", c6.lecture as "L6", c6.tutorial as "T6", c6.practical as "P6", b6.branchname as "Branch6", bs6.sem as "Sem6",
    sc7.semcourseid as "SemCourseID7", c7.coursename as "Course7", c7.lecture as "L7", c7.tutorial as "T7", c7.practical as "P7", b7.branchname as "Branch7", bs7.sem as "Sem7",
    sc8.semcourseid as "SemCourseID8", c8.coursename as "Course8", c8.lecture as "L8", c8.tutorial as "T8", c8.practical as "P8", b8.branchname as "Branch8", bs8.sem as "Sem8",
    sc9.semcourseid as "SemCourseID9", c9.coursename as "Course9", c9.lecture as "L9", c9.tutorial as "T9", c9.practical as "P9", b9.branchname as "Branch9", bs9.sem as "Sem9",
    sc10.semcourseid as "SemCourseID10", c10.coursename as "Course10", c10.lecture as "L10", c10.tutorial as "T10", c10.practical as "P10", b10.branchname as "Branch10", bs10.sem as "Sem10"
    from preferences as pf
    inner join faculty as fc on fc.facultyid = pf.facultyid
    
    left join sem_course as sc1 on sc1.semcourseid = pf.pref1
    left join branch_sem as bs1 on bs1.branchsemid = sc1.branchsemid
    left join branch as b1 on b1.branchid = bs1.branchid
    left join course as c1 on c1.courseid = sc1.courseid
    
    left join sem_course as sc2 on sc2.semcourseid = pf.pref2
    left join branch_sem as bs2 on bs2.branchsemid = sc2.branchsemid
    left join branch as b2 on b2.branchid = bs2.branchid
    left join course as c2 on c2.courseid = sc2.courseid
    
    left join sem_course as sc3 on sc3.semcourseid = pf.pref3
    left join branch_sem as bs3 on bs3.branchsemid = sc3.branchsemid
    left join branch as b3 on b3.branchid = bs3.branchid
    left join course as c3 on c3.courseid = sc3.courseid
     
    left join sem_course as sc4 on sc4.semcourseid = pf.pref4
    left join branch_sem as bs4 on bs4.branchsemid = sc4.branchsemid
    left join branch as b4 on b4.branchid = bs4.branchid
    left join course as c4 on c4.courseid = sc4.courseid
     
    left join sem_course as sc5 on sc5.semcourseid = pf.pref5
    left join branch_sem as bs5 on bs5.branchsemid = sc5.branchsemid
    left join branch as b5 on b5.branchid = bs5.branchid
    left join course as c5 on c5.courseid = sc5.courseid
     
    left join sem_course as sc6 on sc6.semcourseid = pf.pref6
    left join branch_sem as bs6 on bs6.branchsemid = sc6.branchsemid
    left join branch as b6 on b6.branchid = bs6.branchid
    left join course as c6 on c6.courseid = sc6.courseid
    
    left join sem_course as sc7 on sc7.semcourseid = pf.pref7
    left join branch_sem as bs7 on bs7.branchsemid = sc7.branchsemid
    left join branch as b7 on b7.branchid = bs7.branchid
    left join course as c7 on c7.courseid = sc7.courseid
    
    left join sem_course as sc8 on sc8.semcourseid = pf.pref8
    left join branch_sem as bs8 on bs8.branchsemid = sc8.branchsemid
    left join branch as b8 on b8.branchid = bs8.branchid
    left join course as c8 on c8.courseid = sc8.courseid
    
    left join sem_course as sc9 on sc9.semcourseid = pf.pref9
    left join branch_sem as bs9 on bs9.branchsemid = sc9.branchsemid
    left join branch as b9 on b9.branchid = bs9.branchid
    left join course as c9 on c9.courseid = sc9.courseid
    
    left join sem_course as sc10 on sc10.semcourseid = pf.pref10
    left join branch_sem as bs10 on bs10.branchsemid = sc10.branchsemid
    left join branch as b10 on b10.branchid = bs10.branchid
    left join course as c10 on c10.courseid = sc10.courseid
    
    where fc.facultyid = ${req.session.ID};`;

    let _coursesfilled = [];
    // It will fetch the courseid
    client.query(q, (err, result) => {
      if (err) throw err;
      let fr = result["rows"][0];
      let _courses = [];
      for (let i = 1; i <= 10; i++) {
        if (fr[`SemCourseID${i}`]) {
          let temp_c = {
            courseid: fr[`SemCourseID${i}`],
            coursename: fr[`Course${i}`],
            lecture: fr[`L${i}`],
            tutorial: fr[`T${i}`],
            practical: fr[`P${i}`],
          };
          _courses.push(temp_c);
        }
      }
      console.log(_courses);
      res.render("facultyDashboard", {
        user: req.session.name,
        courses: _courses,
      });
    });
  } else {
    res.redirect("login");
  }
};

module.exports = {
  facultyLoginGet,
  facultyLoginPost,
  facultyIndexGet,
  facultyIndexPost,
  facultyDashboardGet,
};
