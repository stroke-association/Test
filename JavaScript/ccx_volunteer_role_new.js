function OnLoad() {
  //  alert ("OnLoad Started 1");    
    var FormType = Xrm.Page.ui.getFormType();
    var Volunteer = Xrm.Page.getAttribute("ccx_volunteer_id").getValue();
    

    if (FormType == 1){          
        if (FormType == 1 && Volunteer == null) {
            alert("Please Note: You can only add a Role from a Volunteer \nThis form will now close");
            Xrm.Page.ui.close();
        }
    }

    Leave_Picklist_Values();
    VnCOfficer();
}// End OnLoad


function Leave_Picklist_Values() {
    //alert("Leave Picklist");
    var CurentValue = Xrm.Page.data.entity.attributes.get("ccx_leaving_reason").getValue();
    var PickList = Xrm.Page.ui.controls.get("ccx_leaving_reason");
    var options = PickList.getAttribute().getOptions();
    for (var i = 0; i < options.length; i++) {
        if ((options[i].value > 10000 && options[i].value != CurentValue) || (options[i].value == 4 || options[i].value == 10 || options[i].value == 19)) {
            PickList.removeOption(options[i].value);
        }
    }
}


function ListDirtyFields() {
    if (Xrm.Page.data.entity.getIsDirty() == true) {

        FormAttributes = Xrm.Page.data.entity.attributes.get();

        var DirtyAttributes = "Dirty:\n\n";

        if (FormAttributes != null) {
            for (var i in FormAttributes) {
                if (FormAttributes[i].getIsDirty()) {
                    DirtyAttributes += FormAttributes[i].getAttributeType() + " / " + FormAttributes[i].getName() + "\n";
                }
            }
        }
        alert(DirtyAttributes);
    }
}

function OnSave() {
    // alert ("OnSave Started");
    // ListDirtyFields();
    Name();
    VnCOfficer();
}// End OnSave


function Name() {
    // Set Role Name // 
    var Volunteer = Xrm.Page.getAttribute("ccx_volunteer_id").getValue()[0].name;
    var RoleType = Xrm.Page.getAttribute("ccx_roletypeid").getValue()[0].name;
    var PostFix = "";
    var ServiceControl = Xrm.Page.getAttribute("ccx_servicecontrol").getValue();
    var StrokeClubandGroupControl = Xrm.Page.getAttribute("ccx_strokeclubandgroupcontrol").getValue();
    //alert ("Name = " + NewName); // Name without Service or Group
        if (ServiceControl == 2) // Las Serivice
        {
            var Service = Xrm.Page.getAttribute("ccx_cs_service_id").getValue()[0].name;
            PostFix = PostFix + PostFix + " / " + Service;
        }

        if (StrokeClubandGroupControl == 2) // Voluntary Groups
        {
            var Group = Xrm.Page.getAttribute("ccx_strokeclubandgroup").getValue()[0].name;
            PostFix = PostFix + PostFix + " / " + Group;
        }
    var NewName = Volunteer + " / " + RoleType + PostFix;
    //alert ("Name = " + NewName);
    Xrm.Page.data.entity.attributes.get("ccx_name").setValue(NewName);
    Xrm.Page.data.entity.attributes.get("ccx_name").setSubmitMode("always");
}


// Calls clear secotion to diables tabs and clear data
function tabdisable(tabname, disablestatus) {
    var tab = Xrm.Page.ui.tabs.get(tabname);
    if (tab == null) alert("Error: The tab: " + tabname + " is not on the form");
    else {
        var tabsections = tab.sections.get();
        for (var i in tabsections) {
            var secname = tabsections[i].getName();
            sectiondisable(secname, disablestatus);
        }
    }
}   // tabdisable

// Deasbles / Reenables the section and clears the data bases on passed paramiter
function sectiondisable(sectionname, disablestatus) {
    var ctrlName = Xrm.Page.ui.controls.get();
    for (var i in ctrlName) {
        var ctrl = ctrlName[i];
        var ctrlSection = ctrl.getParent().getName();
        if (ctrlSection == sectionname) {
            var attributelocal = ctrl.getAttribute();
            ctrl.setDisabled(disablestatus);
        }
    }
}  // sectiondisable


function RoleTypeLookup() {
   // alert("RoleTypeStart");

    var CheckStatus = Xrm.Page.getAttribute("ccx_check_status").getValue(); // 1= NA, 2 = Required - Requested, 3 = Required - Supervised Alowed, 4 = Required - Valid, 5 = Required - Not Valid 
    var TrainingStatus = Xrm.Page.getAttribute("ccx_mandatorytrainingstatus").getValue(); // 1 = NA, 2 Required - Not compleated, 3 = Required - Supervised Alowed, 4 = Required - Compleated
    var ReferencesStatus = Xrm.Page.getAttribute("ccx_referencesstatus").getValue();  // 1 = NA, 2 = Required - Valid, 3 = Required - Not Valid
    var DrivingStatus = Xrm.Page.getAttribute("ccx_drivingstatus").getValue(); // 1 = NA, 4 = Required - Valid, 5 = Required - Not Valid
    var ServiceControl = Xrm.Page.getAttribute("ccx_servicecontrol").getValue(); // 1 = Optional, 2 = Mandatory, 3 = Restricted
    var ClubandGroupControl = Xrm.Page.getAttribute("ccx_strokeclubandgroupcontrol").getValue(); // 1 = Optional, 2 = Mandatory, 3 = Restricted

    alert("CheckStatus = " + CheckStatus + "\nTrainingStatus = " + TrainingStatus + "\nReferencesStatus = " + ReferencesStatus + "\nDrivingStatus = " + DrivingStatus + "\nServiceControl = " + ServiceControl + "\nClubandGroupControl = " + ClubandGroupControl);


    // Create View Role
    defaultViewId = Xrm.Page.getControl("ccx_roletypeid").getDefaultView();
    var viewId = "{1DFB2B35-B07C-44D1-868D-258DEEAB88E2}";
    var entityName = "ccx_volunteerroletype";
    var viewDisplayName = "Relevant Role Types";
    var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
    "<entity name='ccx_volunteerroletype'>" +
    "<attribute name='ccx_volunteerroletypeid' />" +
    "<attribute name='ccx_name' />" +
    "<order attribute='ccx_name' descending='false' />" +
    "<filter type='and'>" +
    "<condition attribute='statecode' operator='eq' value='0' />" +
    "<condition attribute='ccx_legacy' operator='eq' value='0' />"; //legacy


    //if (ReferencesBit == false) {
    //    fetchXml += 
    //    "<condition attribute='ccx_referencesrequired' operator='eq' value='0' />";
    //}
    //if (ReferencesBit == true) {
    //    fetchXml += 
    //    "<condition attribute='ccx_referencesrequired' operator='in'>" +
    //    "<value>0</value>" +
    //    "<value>1</value>" +
    //    "</condition>";
    //}
    if (CheckStatus == 1 || CheckStatus == 2 || CheckStatus == 5) {
        fetchXml += 
        "<condition attribute='ccx_checksrequired' operator='eq' value='0' />";
    }
    if (CheckStatus == 3) {
        fetchXml += 
        "<condition attribute='ccx_checksrequired' operator='eq' value='1' />" +
        "<condition attribute='ccx_supervised_activity' operator='eq' value='1' />";
    }
    if (CheckStatus == 4) {
        fetchXml +=
       "<condition attribute='ccx_checksrequired' operator='eq' value='1' />";
    }

    //if (DrivingBitValue == 0) //no
    //{
    //    fetchXml = fetchXml +
    //    "<condition attribute='ccx_drivingrole' operator='eq' value='0' />";
    //}
    //if (DrivingBitValue == 1) //yes
    //{
    //    fetchXml = fetchXml +
    //    "<condition attribute='ccx_drivingrole' operator='in'>" +
    //    "<value>0</value>" +
    //    "<value>1</value>" +
    //    "</condition>";
    //}

    fetchXml +=
    "</filter>" +
    "</entity>" +
    "</fetch>";
    var layoutXml = "<grid name='resultset' object='1' jump='ccx_volunteerroletypeid' " +
    "select='1' icon='1' preview='1'> <row name='result' id='ccx_volunteerroletypeid'>" +
    "<cell name='ccx_name' width='300' />" +
    "</row> </grid>";
    Xrm.Page.getControl("ccx_roletypeid").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
    /*Xrm.Page.getControl("ccx_activitycodelookup").getCustomView(defaultViewId).setVisible(false);*/


}

function VnCOfficer() {
    var VCOfficer = Xrm.Page.getAttribute("ccx_vcofficer").getValue();
    Xrm.Page.ui.clearFormNotification("1");
    if (VCOfficer == null) {        
        Xrm.Page.ui.setFormNotification("Please select your V&C Officer", "INFO", "1");
    }


}
