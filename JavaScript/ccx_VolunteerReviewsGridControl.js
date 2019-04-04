function RewardsGridControl() {
    var Entity = Xrm.Page.data.entity.getEntityName();
    var Result = true;
    //alert("Entity False = " + Entity);

    if (Entity == 'ccx_volunteer') {
        var VolunteerStatus = Xrm.Page.data.entity.attributes.get("ccx_volunteerstatus").getValue();
        var AgeBit = Xrm.Page.getAttribute("ccx_agebit").getValue();
        if (AgeBit == false || VolunteerStatus == 1 || VolunteerStatus == 7 || VolunteerStatus == 8 || VolunteerStatus == 9) {
            Result = false;
        }
    }

    if (Entity == 'XXccx_volunteer_roleXX') {
        Result = false;
        var RoleStatus = Xrm.Page.data.entity.attributes.get("ccx_rolestatus").getValue();     
        var User = Xrm.Page.context.getUserId();
        if (RoleStatus != 4) {
            
            var RoleManager = Xrm.Page.data.entity.attributes.get("ccx_role_manager_id").getValue()[0].id;
            var RoleLineManager = Xrm.Page.data.entity.attributes.get("ccx_volunteer_role_line_manager_id").getValue()[0].id;
            //alert("User = " + User + "\nRoleManager = " + RoleManager + "\nRoleLineManager = " + RoleLineManager);

            if (User == RoleManager || User == RoleLineManager)
            {
               // alert("UserTest = true");
                Result = true;
            }

            var Role_VolunteerManager = '3A7B3BE9-FBBB-E811-8101-00155D005F09'; // Update with id from live system
            Role_VolunteerManager = Role_VolunteerManager.toLowerCase();

            var userId = User.slice(1, -1);
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/systemuserrolescollection?$select=roleid&$filter=systemuserid eq " + userId + "", true);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var results = JSON.parse(this.response);
                        for (var i = 0; i < results.value.length; i++) {
                            var userRoleId = results.value[i].roleid;
                            //var userRoleName = GetRoleName(userRoleId);

                           // alert("userRoleId = " + userRoleId + "\nRoleManager = " + Role_VolunteerManager);
                            if (userRoleId == Role_VolunteerManager) {
                                //alert("BOB");
                                Result = true;
                            }
                        }
                    } else {
                        Xrm.Utility.alertDialog(this.statusText);
                    }
                }
            };
            req.send();
        }
        //CheckUserRole();
   }

//alert("Result = " + Result);
return Result
}

function GetRoleName(roleId) {
    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/roles(" + roleId + ")?$select=name", false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var result = JSON.parse(this.response);
                var roleName = result["name"];
               // alert(roleName);
            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
}