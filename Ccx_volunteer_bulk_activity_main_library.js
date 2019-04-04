function OnLoad() {
    //alert("OnLoad 2");
    var FormType = Xrm.Page.ui.getFormType();
    var BulkActivityCompleate = Xrm.Page.getAttribute("ccx_volunteerbulkactivitycompleate").getValue();
    Xrm.Page.ui.controls.get("statuscode").setDisabled(true);
    Xrm.Page.getAttribute("ccx_name").setValue("Draft");

    if (FormType != 1) {
        RefreshTip();
        //Validation('OnLoad')
        Validation('OnLoad');
    
    }

}//END OnLoad

function OnSave() {
    // Set Name
    if (Xrm.Page.getAttribute("ccx_activitycodelookup").getValue() != null) {
        Xrm.Page.getAttribute("ccx_name").setValue(Xrm.Page.getAttribute("ccx_activitycodelookup").getValue()[0].name.substring(0, 150));
        Xrm.Page.getAttribute("ccx_name").setSubmitMode("always");
    }
    RefreshTip();
}//END OnSave


function Validation(Trigger) {
    // alert("Validation Start 8.2 v700.8 - Trigger = " + Trigger);

    var BulkActivityCompleate = Xrm.Page.getAttribute("ccx_volunteerbulkactivitycompleate").getValue();
    var FormType = Xrm.Page.ui.getFormType();
    var StatusReason = Xrm.Page.getAttribute("statuscode").getValue();
    var LogValidation = true;
    var RoleCount = 0;
    var CluborGroupCount = 0;

    if ((FormType != 1 && Trigger == 'OnLoad' && BulkActivityCompleate == false) || (FormType != 1 && Trigger == 'OnChange' && BulkActivityCompleate == true)) {

        //alert("StartChecking");

        var ChecksRequired = Xrm.Page.getAttribute("ccx_checksrequired").getValue();
        var SupervisedActivityAlowed = Xrm.Page.getAttribute("ccx_supervised_activity").getValue();
        var ReferancesRequired = Xrm.Page.getAttribute("ccx_referencesrequired").getValue();
        var ServiceRequired = Xrm.Page.getAttribute("ccx_service").getValue();
        var StrokeCluborGroupRequired = Xrm.Page.getAttribute("ccx_strokeclubandgroup").getValue();
        var TrainingSupervisedActivityAllowed = Xrm.Page.getAttribute("ccx_trainingsupervisedactivityallowed").getValue();
        var DrivingActivity = Xrm.Page.getAttribute("ccx_drivingactivity").getValue();

        //alert("ChecksRequired = " + ChecksRequired
        //    + "\nSupervisedActivityAlowed = " + SupervisedActivityAlowed
        //    + "\nTrainingSupervisedActivityAllowed = " + TrainingSupervisedActivityAllowed
        //    + "\nServiceRequired = " + ServiceRequired
        //    + "\nStrokeCluborGroupRequired = " + StrokeCluborGroupRequired
        //    + "\nReferancesRequired = " + ReferancesRequired
        //    + "\nDrivingActivity = " + DrivingActivity
        //    );

        var VolBulkActivityID = Xrm.Page.data.entity.getId();
        //alert("VolBulkActivityID Dirty = " + VolBulkActivityID);
        VolBulkActivityID = VolBulkActivityID.replace('{', "");
        VolBulkActivityID = VolBulkActivityID.replace('}', "");
        //alert("VolBulkActivityID Clean = " + VolBulkActivityID);

        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ccx_volunteer_bulk_activities(" + VolBulkActivityID + ")?$select=ccx_name&$expand=ccx_VolBulkActivityRelatedVolRoles($select=ccx_volunteer_roleid)", true);
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
                    var ccx_name = result["ccx_name"];
                    for (var a = 0; a < result.ccx_VolBulkActivityRelatedVolRoles.length; a++) {
                        var ccx_VolBulkActivityRelatedVolRoles_ccx_volunteer_roleid = result.ccx_VolBulkActivityRelatedVolRoles[a]["ccx_volunteer_roleid"];                      
                
                        //alert("Role ID = " + ccx_VolBulkActivityRelatedVolRoles_ccx_volunteer_roleid);

                        RoleCount = RoleCount+1;     


                        var req2 = new XMLHttpRequest();
                        req2.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ccx_volunteer_roles(" + ccx_VolBulkActivityRelatedVolRoles_ccx_volunteer_roleid + ")?$select=ccx_activitycontrol,ccx_check_status,_ccx_cs_service_id_value,ccx_drivingstatus,ccx_mandatorytrainingstatus,ccx_name,ccx_referencesstatus,ccx_rolestatus,_ccx_strokeclubandgroup_value", false);
                        req2.setRequestHeader("OData-MaxVersion", "4.0");
                        req2.setRequestHeader("OData-Version", "4.0");
                        req2.setRequestHeader("Accept", "application/json");
                        req2.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req2.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                        req2.onreadystatechange = function () {
                            if (this.readyState === 4) {
                                req2.onreadystatechange = null;
                                if (this.status === 200) {
                                    var result2 = JSON.parse(this.response);
                                    var ccx_activitycontrol = result2["ccx_activitycontrol"];
                                    var ccx_activitycontrol_formatted = result2["ccx_activitycontrol@OData.Community.Display.V1.FormattedValue"];
                                    var ccx_check_status = result2["ccx_check_status"];
                                    var ccx_check_status_formatted = result2["ccx_check_status@OData.Community.Display.V1.FormattedValue"];
                                    var _ccx_cs_service_id_value = result2["_ccx_cs_service_id_value"];
                                    var _ccx_cs_service_id_value_formatted = result2["_ccx_cs_service_id_value@OData.Community.Display.V1.FormattedValue"];
                                    var _ccx_cs_service_id_value_lookuplogicalname = result2["_ccx_cs_service_id_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                                    var ccx_drivingstatus = result2["ccx_drivingstatus"];
                                    var ccx_drivingstatus_formatted = result2["ccx_drivingstatus@OData.Community.Display.V1.FormattedValue"];
                                    var ccx_mandatorytrainingstatus = result2["ccx_mandatorytrainingstatus"];
                                    var ccx_mandatorytrainingstatus_formatted = result2["ccx_mandatorytrainingstatus@OData.Community.Display.V1.FormattedValue"];
                                    var ccx_name = result2["ccx_name"];
                                    var ccx_referencesstatus = result2["ccx_referencesstatus"];
                                    var ccx_referencesstatus_formatted = result2["ccx_referencesstatus@OData.Community.Display.V1.FormattedValue"];
                                    var ccx_rolestatus = result2["ccx_rolestatus"];
                                    var ccx_rolestatus_formatted = result2["ccx_rolestatus@OData.Community.Display.V1.FormattedValue"];
                                    var _ccx_strokeclubandgroup_value = result2["_ccx_strokeclubandgroup_value"];
                                    var _ccx_strokeclubandgroup_value_formatted = result2["_ccx_strokeclubandgroup_value@OData.Community.Display.V1.FormattedValue"];
                                    var _ccx_strokeclubandgroup_value_lookuplogicalname = result2["_ccx_strokeclubandgroup_value@Microsoft.Dynamics.CRM.lookuplogicalname"];

                                    //alert("Name = " + ccx_name
                                    //    + "\n"
                                    //    + "\nccx_activitycontrol = " + ccx_activitycontrol + " - " + ccx_activitycontrol_formatted
                                    //    + "\nccx_rolestatus = " + ccx_rolestatus + " - " + ccx_rolestatus_formatted
                                    //    + "\nccx_check_status = " + ccx_check_status + " - " + ccx_check_status_formatted
                                    //    + "\nccx_drivingstatuss = " + ccx_drivingstatus + " - " + ccx_drivingstatus_formatted
                                    //    + "\nccx_mandatorytrainingstatus = " + ccx_mandatorytrainingstatus + " - " + ccx_mandatorytrainingstatus_formatted
                                    //    + "\nccx_referencesstatus = " + ccx_referencesstatus + " - " + ccx_referencesstatus_formatted
                                    //    + "\n_ccx_cs_service_id_value = " + _ccx_cs_service_id_value + " - " + _ccx_cs_service_id_value_formatted + " - " + _ccx_cs_service_id_value_lookuplogicalname
                                    //    + "\n_ccx_strokeclubandgroup_value = " + _ccx_strokeclubandgroup_value + " - " + _ccx_strokeclubandgroup_value_formatted + " - " + _ccx_strokeclubandgroup_value_lookuplogicalname
                                    //      );
                                      
                                    //alert(" 5 Name = " + ccx_name
                                    //+ "\n"
                                    //+ "\nccx_rolestatus = " + ccx_rolestatus + " - " + ccx_rolestatus_formatted
                                    //+ "\nChecksRequired = " + ChecksRequired + "\nccx_check_status = " + ccx_check_status + " - " + ccx_check_status_formatted
                                    //+ "\nSupervisedActivityAlowed = " + SupervisedActivityAlowed
                                    //+ "\nTrainingSupervisedActivityAllowed = " + TrainingSupervisedActivityAllowed + "\nccx_mandatorytrainingstatus = " + ccx_mandatorytrainingstatus + " - " + ccx_mandatorytrainingstatus_formatted
                                    //+ "\nServiceRequired = " + ServiceRequired + "\n_ccx_cs_service_id_value = " + _ccx_cs_service_id_value_lookuplogicalname
                                    //+ "\nStrokeCluborGroupRequired = " + StrokeCluborGroupRequired + "\n_ccx_strokeclubandgroup_value = " + _ccx_strokeclubandgroup_value_lookuplogicalname
                                    //+ "\nReferancesRequired = " + ReferancesRequired + "\nccx_referencesstatus = " + ccx_referencesstatus + " - " + ccx_referencesstatus_formatted
                                    //+ "\nDrivingActivity = " + DrivingActivity + "\nccx_drivingstatuss = " + ccx_drivingstatus + " - " + ccx_drivingstatus_formatted
                                    //);

                                    // Rolestatus = 1 New Role, 2 Active , 3 No Resent activity, 4 Closed
                                    // CheckStatus = 1= NA, 2 = Required - Requested, 3 = Required - Supervised Alowed, 4 = Required - Valid, 5 = Required - Not Valid 
                                    // TrainingStatus =  1 = NA, 2 Required - Not compleated, 3 = Required - Supervised Alowed, 4 = Required - Compleated
                                    // ReferencesStatus = 1 = NA, 2 = Required - Valid, 3 = Required - Not Valid, 4 NA Valid
                                    // DrivingStatus = 1 = NA, 4 = Required - Valid, 5 = Required - Not Valid
                                    // Service = 1 = Optional, 2 = Mandatory, 3 = Restricted
                                    // ClubandGroup = 1 = Optional, 2 = Mandatory, 3 = Restricted

                                    var RoleValidation = true;
                                    var ErrorText = "";                                    
                                   
                                    if (ccx_rolestatus == 4) {
                                        RoleValidation = false;
                                        ErrorText = ErrorText + " # Role Closed";
                                    }
                                    if (ccx_rolestatus != 4) {

                                        if (ccx_mandatorytrainingstatus == 2) {
                                            RoleValidation = false;
                                            ErrorText = ErrorText + " # Mandatory Training Required";
                                        }

                                        if (ccx_mandatorytrainingstatus == 3 && TrainingSupervisedActivityAllowed != 1) {
                                            RoleValidation = false;
                                            ErrorText = ErrorText + " # Mandatory Training Required";
                                        }

                                        if (ChecksRequired == 1 && SupervisedActivityAlowed == 0 && ccx_check_status != 4) {
                                            RoleValidation = false;
                                            ErrorText = ErrorText + " # Valid Check Required";
                                        }

                                        if (ChecksRequired == 1 && SupervisedActivityAlowed == 1 && (ccx_check_status == 1 || ccx_check_status == 2 || ccx_check_status == 5)) {
                                            RoleValidation = false;
                                            ErrorText = ErrorText + " # Requested or Valid Check Required";
                                        }

                                        //alert("Pre Check");
                                        if (ReferancesRequired == 1 && ccx_referencesstatus == 1 || ccx_referencesstatus == 3) {
                                            RoleValidation = false;
                                            ErrorText = ErrorText + " # References Required";
                                        }

                                        if (DrivingActivity == 1 && ccx_drivingstatus == 1) {
                                            RoleValidation = false;
                                            ErrorText = ErrorText + " # Not a Driving Role";
                                        }

                                        if (DrivingActivity == 1 && ccx_drivingstatus != 4) {
                                            RoleValidation = false;
                                            ErrorText = ErrorText + " # Valid Driving Detals Required";
                                        }

                                        if (ServiceRequired == 2 && _ccx_cs_service_id_value == null) {
                                            RoleValidation = false;
                                            ErrorText = ErrorText + " # Service Required";
                                        }

                                        if (ServiceRequired == 3 && _ccx_cs_service_id_value != null) {
                                            RoleValidation = false;
                                            ErrorText = ErrorText + " # Service Restricted";
                                        }

                                        if (StrokeCluborGroupRequired == 2 && _ccx_strokeclubandgroup_value == null) {
                                            RoleValidation = false;
                                            ErrorText = ErrorText + " # Stroke Club or Group Required";
                                        }

                                        if (StrokeCluborGroupRequired == 3 && _ccx_strokeclubandgroup_value != null) {
                                            RoleValidation = false;
                                            ErrorText = ErrorText + " # Stroke Club or Group Restricted";
                                        }
                                    }
                                    //alert("Validation = " + Validation);
                                    if (RoleValidation == false) {
                                        LogValidation = false;
                                        Xrm.Page.ui.setFormNotification(ccx_name + " - Errors " + ErrorText, "ERROR");
                                    }
                                    //alert("Inside LogValidation = " + LogValidation);
                                 
                                } else {
                                    Xrm.Utility.alertDialog(this.statusText);                           
                                }              
                            } 
                        };               
                        req2.send();
                        
                    }
                    //Xrm.Page.ui.setFormNotification("LogValidation 6 = " + LogValidation, "INFO");
                } else {
                    Xrm.Utility.alertDialog(this.statusText); 
                }
                //Xrm.Page.ui.setFormNotification("RoleCount = " + RoleCount + " LogValidation = " + LogValidation, "INFO");

                //alert("Outside LogValidation = " + LogValidation);




                var req4 = new XMLHttpRequest();
                req4.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ccx_volunteer_bulk_activities(" + VolBulkActivityID + ")?$expand=ccx_ccx_volunteer_bulk_activity_ccx_strokecly($select=ccx_name)", false);
                req4.setRequestHeader("OData-MaxVersion", "4.0");
                req4.setRequestHeader("OData-Version", "4.0");
                req4.setRequestHeader("Accept", "application/json");
                req4.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req4.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                req4.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req4.onreadystatechange = null;
                        if (this.status === 200) {
                            var result4 = JSON.parse(this.response);
                            var ccx_volunteer_bulk_activityid = result4["ccx_volunteer_bulk_activityid"];
                            for (var a = 0; a < result4.ccx_ccx_volunteer_bulk_activity_ccx_strokecly.length; a++) {
                                var ccx_ccx_volunteer_bulk_activity_ccx_strokecly_ccx_name = result4.ccx_ccx_volunteer_bulk_activity_ccx_strokecly[a]["ccx_name"];
                                //alert("ccx_ccx_volunteer_bulk_activity_ccx_strokecly_ccx_name" + ccx_ccx_volunteer_bulk_activity_ccx_strokecly_ccx_name)
                                CluborGroupCount = CluborGroupCount + 1;
                            }
                        } else {
                            Xrm.Utility.alertDialog(this.statusText);
                        }
                    }
                };
                req4.send();


                if (RoleCount == 0 && CluborGroupCount == 0) {
                    Xrm.Page.ui.setFormNotification("No Roles or Stroke Clubs and Groups Selected", "ERROR");
                }

                if (LogValidation == true && BulkActivityCompleate == false && (RoleCount > 0 || CluborGroupCount > 0)) {
                    Xrm.Page.ui.controls.get("ccx_volunteerbulkactivitycompleate").setDisabled(false);
                    Xrm.Page.ui.setFormNotification("Ready for Completion", "INFO");
                }

                if (Trigger == 'OnChange' && LogValidation == true && BulkActivityCompleate == true && (RoleCount >0 || CluborGroupCount>0)) {
                     //  alert ("CheckOK = True" )   
                    var result = confirm("Warning!\n\nThis will Save and Lock the record.\nAdd all attendees before setting Status to Complete.\n\nDo you wish to continue?  ");
                    if (result) {
                        //        alert("You pressed OK! " + result);
                        Xrm.Page.data.entity.attributes.get("statuscode").setValue(3);
                        Xrm.Page.ui.controls.get("ccx_volunteerbulkactivitycompleate").setDisabled(true);
                        Xrm.Page.data.entity.save();                  
                        Xrm.Page.ui.controls.get("ccx_activitycodelookup").setDisabled(true);
                        Xrm.Page.ui.controls.get("ccx_activity_date").setDisabled(true);
                        Xrm.Page.ui.controls.get("ccx_duration").setDisabled(true);
                        Xrm.Page.ui.controls.get("ccx_description").setDisabled(true);
                    }
                    else {
                         //   alert("You pressed Cancel! "+ result);
                        Xrm.Page.data.entity.attributes.get("ccx_volunteerbulkactivitycompleate").setValue(0);
                    }
                }

            }

        };
 
        req.send();
   
    }

   
}

function RefreshTip() {

    Xrm.Page.ui.clearFormNotification("1");
    var BulkActivityCompleate = Xrm.Page.getAttribute("ccx_volunteerbulkactivitycompleate").getValue();

    if (BulkActivityCompleate == false) {
        Xrm.Page.ui.setFormNotification("Press F5 to update", "BOB","1");
    }
}