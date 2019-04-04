function OnLoad() {
    //alert("OnLoad Started");
    Xrm.Page.ui.clearFormNotification("1");
    var FormType = Xrm.Page.ui.getFormType();
    Xrm.Page.ui.clearFormNotification("61");
    Rejection_Picklist_Values();
    Leave_Picklist_Values();
    //ListDirtyFields();


    if (FormType != 1) {
        Hint();
        Deceased();
        RedFlag();
        DOBNotKnown();
        EmailNotKnown();
        AgeCheck();
    }

    Volunteer_Manager_Statuses();
}

function OnSave()//ok
{
    Xrm.Page.ui.clearFormNotification("61");
    //alert("onsave");     
    Hint();
    AgeCheck();
    //ListDirtyFields();

    var Contact = Xrm.Page.getAttribute("ccx_contactid").getValue()[0].name;
    // Set Name
    if (Contact != null) {
        Xrm.Page.data.entity.attributes.get("ccx_name").setValue(Contact);
        Xrm.Page.data.entity.attributes.get("ccx_name").setSubmitMode("always");
    }
    Volunteer_Manager_Statuses();
} // End On Save

function Rejection_Picklist_Values() {
    //alert("Rejection Picklist");
    var CurentValue = Xrm.Page.data.entity.attributes.get("ccx_applicationrejectedreason").getValue();
    var PickList = Xrm.Page.ui.controls.get("ccx_applicationrejectedreason");
    var options = PickList.getAttribute().getOptions();
    for (var i = 0; i < options.length; i++) {
        if (options[i].value < 10000) {
            PickList.removeOption(options[i].value);
        }
    }
}

function Leave_Picklist_Values() {
    //alert("Leave Picklist");
    var CurentValue = Xrm.Page.data.entity.attributes.get("ccx_volunteer_leaving_reason").getValue();
    var PickList = Xrm.Page.ui.controls.get("ccx_volunteer_leaving_reason");
    var options = PickList.getAttribute().getOptions();
    for (var i = 0; i < options.length; i++) {
        if ((options[i].value > 10000 && options[i].value != CurentValue) || (options[i].value == 4 || options[i].value == 10 || options[i].value == 19)) {
            PickList.removeOption(options[i].value);
        }
    }
}

function Deceased() {
    var Deceased = Xrm.Page.getAttribute("ccx_deceased").getValue();
    if (Deceased == 1) {
        Xrm.Page.ui.setFormNotification("Contact is marked as deceased", "WARNING", "40");
    }

} // End Deceased

function RedFlag() {
    var RedFlag = Xrm.Page.getAttribute("ccx_redflag").getValue();
    if (RedFlag == 1) {
        Xrm.Page.ui.setFormNotification("Contact is marked as red flagged", "WARNING", "50");
    }

} // End RedFlag


function EmailNotKnown()//ok
{
    var Email = Xrm.Page.getAttribute("ccx_email").getValue();
    if (Email == null) {
        Xrm.Page.ui.setFormNotification("Email missing on Contact", "WARNING", "10");
    }

} // End EmailNotProvided

function DOBNotKnown()//ok
{
    var Age = Xrm.Page.getAttribute("ccx_age").getValue();
    if (Age == null) {
        Xrm.Page.ui.setFormNotification("Date of Birth missing on Contact", "WARNING", "20");
    }

} // End DOBNotProvided


function AgeCheck() {
    Xrm.Page.ui.clearFormNotification("30");
    var Age = Xrm.Page.getAttribute("ccx_age").getValue();
    var ContactZone = Xrm.Page.getAttribute("ccx_contactzone").getValue();    // 1 = Not Scotland     // 2 = Scotland
    var Text = "";
    var Error = false;
    //  IS A MINOR
    if ((ContactZone == 1 && Age < 18 && Age != null) || (ContactZone == 2 && Age < 16 && Age != null)) {
        var ConsentSent = Xrm.Page.getAttribute("ccx_parental_consent_sent_date").getValue();
        var ConsentRecived = Xrm.Page.getAttribute("ccx_parental_consent_received_date").getValue();
        var RiskAssessment = Xrm.Page.getAttribute("ccx_young_persons_risk_assessment_date").getValue();

        if (ConsentSent == null) {
            // Xrm.Page.ui.setFormNotification("Parental Consent Form not Sent", "WARNING","3");
            Text += "Parental Consent Form not Sent - ";
            Error = true;
        }

        if (ConsentRecived == null) {
            // Xrm.Page.ui.setFormNotification("Parental Consent Form not Received", "WARNING","4");
            Text += "Parental Consent Form not Received - ";
            Error = true;
        }

        if (RiskAssessment == null) {
            // Xrm.Page.ui.setFormNotification("Young Persons Risk Assessment Not Completed", "WARNING","5");
            Text += "Not Completed";
            Error = true;
        }

        if (Error == true) {
            Xrm.Page.ui.setFormNotification("Young Persons Risk Assessment : " + Text, "ERROR", "30");
        }
    } // END IS Minor   
} // END Under18

function Hint() {
    Xrm.Page.ui.clearFormNotification("1");
    //alert("Hint Started"); 

    var VolunteerStatus = Xrm.Page.data.entity.attributes.get("ccx_volunteerstatus").getValue();
    var AgeBit = Xrm.Page.getAttribute("ccx_agebit").getValue();
    var TrialStartDate = Xrm.Page.getAttribute("ccx_trialstartdate").getValue();
    var InterviewCompleate = Xrm.Page.getAttribute("ccx_interview_complete").getValue();
    var InactiveThreshold = Xrm.Page.data.entity.attributes.get("ccx_inactivitythreshold").getValue();
    var Text = "";
    var Error = false;

    //alert("VolunteerStats = " + VolunteerStatus);
    //alert("interviewCompleate = " + InterviewCompleate);

    if (InterviewCompleate == 0) // Expression of Interest
    {
        Text += "Complete Interview";
        Error = true;
    }

    if (InterviewCompleate == 1 && (InactiveThreshold == null || InactiveThreshold == 0)) // Interview Completed
    {
        Text += "Add Role";
        Error = true;
    }

    if (InterviewCompleate == 1 && TrialStartDate == null && InactiveThreshold > 0) // Start Trial
    {
        Text += "Add Activity from Role";
        Error = true;
    }

    if (Error == true && VolunteerStatus < 7) {
        Xrm.Page.ui.clearFormNotification("1");
        Xrm.Page.ui.setFormNotification("Next Step = " + Text, "INFO", "1");
    }

}

/*   Function to ensure that application date is not in the future
      A business rule cannot be used because it does not have access to 'today' until the record has been saved
      This code is derived from the Stroke Clubs and Groups JavaScript by CJSH November 2018
      The field notification supersedes the built-in validation, hence not just a test on the date value
*/
function block_future_application_date() {
    var today = new Date();
    var application_date = Xrm.Page.getAttribute("ccx_application_date").getValue();

    if (application_date == null || (application_date.getTime() - today.getTime() > 0)) {
        Xrm.Page.getControl("ccx_application_date").setNotification("Application date must be entered and not be in the future");
    }
    else {
        Xrm.Page.getControl("ccx_application_date").clearNotification();
    }
}

function ContactUpdate() {

    var ContactID = Xrm.Page.getAttribute("ccx_contactid").getValue()[0].id;
    //alert("ContactID Dirty = " + ContactID);
    ContactID = ContactID.replace('{', "");
    ContactID = ContactID.replace('}', "");
    //alert("ContactID Clean = " + ContactID);


    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/contacts(" + ContactID + ")?$select=ccx_deceased,ccx_redflagbit", true);
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
                var ccx_deceased = result["ccx_deceased"];
                var ccx_deceased_formatted = result["ccx_deceased@OData.Community.Display.V1.FormattedValue"];
                var ccx_redflagbit = result["ccx_redflagbit"];
                var ccx_redflagbit_formatted = result["ccx_redflagbit@OData.Community.Display.V1.FormattedValue"];

                //alert("ccx_deceased " + ccx_deceased + "\nccx_redflagbit " + ccx_redflagbit);
                Xrm.Page.data.entity.attributes.get("ccx_deceased").setValue(ccx_deceased);
                Xrm.Page.data.entity.attributes.get("ccx_deceased").setSubmitMode("always");
                Xrm.Page.data.entity.attributes.get("ccx_redflag").setValue(ccx_redflagbit);
                Xrm.Page.data.entity.attributes.get("ccx_redflag").setSubmitMode("always");

            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();


}
/* notifications don't work properly if more than 3, so these are merged */
function Volunteer_Manager_Statuses() {
    Xrm.Page.ui.clearFormNotification("61");
    var Text = "";
    var Error = false;   
    var VM_status = Xrm.Page.getAttribute("ccx_volunteer_manager_status").getValue();
    var VA_status = Xrm.Page.getAttribute("ccx_volunteer_admin_status").getValue();
    var LM_status = Xrm.Page.getAttribute("ccx_line_manager_status").getValue();
    // alert(VM_status);
    
    if (VM_status == 1) {
        Text += " - Volunteer Manager";
        Error = true;
    }
    if (VA_status == 1) {
        Text += " - Volunteer Admin";
        Error = true;
    }
    if (LM_status == 1) {
        Text += " - Volunteer Line Manager";
        Error = true;
    }
    
    if(Error == true){
        Xrm.Page.ui.setFormNotification("Need Review" + Text, "ERROR", "61");
    }

}
