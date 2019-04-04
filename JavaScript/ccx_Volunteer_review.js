function OnLoad()
{
var FormType = Xrm.Page.ui.getFormType();
var Volunteer = Xrm.Page.getAttribute("ccx_volunteerid").getValue();
var Role = Xrm.Page.getAttribute("ccx_volunteer_role_id").getValue();

    if (FormType == 1) // Create
    {     
        if (Volunteer == null && Role == null)
        {
        alert ("Please Note: \nYou can only add a review from the Volunteer or the Volunteer Role \nThis form will now close.");
        Xrm.Page.ui.close();
        }
        
    Xrm.Page.data.entity.attributes.get("ccx_name").setValue('New');
    }

// hide auto-generated review types
if (Xrm.Page.data.entity.attributes.get("ccx_review_type").getValue()!=3) {
  Xrm.Page.getControl("ccx_review_type").removeOption(3); }
if (Xrm.Page.data.entity.attributes.get("ccx_review_type").getValue()!=4) {
  Xrm.Page.getControl("ccx_review_type").removeOption(4); }
if (Xrm.Page.data.entity.attributes.get("ccx_review_type").getValue()!=5) {
  Xrm.Page.getControl("ccx_review_type").removeOption(5); }

duration();

if (Xrm.Page.data.entity.attributes.get("statuscode").getValue() !=1)
 {
  formdisable(true); // disable all fields
  }

}

function OnSave()
{
Name();
}

function Name()
{
var ReviewDate = Xrm.Page.getAttribute("ccx_review_date").getValue();
var VolunteerName = Xrm.Page.getAttribute("ccx_volunteerid").getValue()[0].name;

var Day = ReviewDate.getDate();
var Month = ReviewDate.getMonth()+1;
var Year = ReviewDate.getFullYear();

//alert ("Day = " + Day + "\nMonth = " + Month + "\nYear = " + Year);

var NewName = VolunteerName + " " + Day + "/" + Month + "/" + Year;

Xrm.Page.data.entity.attributes.get("ccx_name").setValue(NewName);
Xrm.Page.data.entity.attributes.get("ccx_name").setSubmitMode("always");
} // End Name

function formdisable(disablestatus)
{
    var allAttributes = Xrm.Page.data.entity.attributes.get();
    for (var i in allAttributes) {
           var myattribute = Xrm.Page.data.entity.attributes.get(allAttributes[i].getName());
           var myname = myattribute.getName();
           Xrm.Page.getControl(myname).setDisabled(disablestatus); 
    }
} // formdisable

function statuscode_onchange()
{
if (Xrm.Page.data.entity.attributes.get("statuscode").getValue() ==100000000)
  {alert('This will mark the review as completed on saving, and no further changes will then be possible.\n'+
            'Please ensure that all data has been correctly entered before saving.');
    if (Xrm.Page.data.entity.attributes.get("ccx_review_type").getValue() ==1)
               {alert('A Volunteer Activity Log will be automatically created.\n'+
                'If this review relates to a Service please create a Service Log as appropriate.');
               }
  }

if (Xrm.Page.data.entity.attributes.get("statuscode").getValue() ==100000001)
  {alert('This will deactivate the review on saving, and no data from it will then be accessible.\n'+
            'Please be sure that no data from this review is required before saving.');
  }
}

function duration() // enable or disable duration, next review date, date copy given depending on review type
{
//alert("in duration");
if (Xrm.Page.getAttribute("ccx_review_type").getValue() > 1)
   {
   Xrm.Page.ui.tabs.get("General").sections.get("Review").setVisible(false);
   Xrm.Page.ui.tabs.get("General").sections.get("Future").setVisible(false);
   Xrm.Page.ui.tabs.get("General").sections.get("Summary").setVisible(false);
   Xrm.Page.ui.controls.get("ccx_duration").setDisabled(true);
   Xrm.Page.data.entity.attributes.get("ccx_duration").setRequiredLevel("none");
   if (Xrm.Page.data.entity.attributes.get("ccx_duration").getValue() == null)
       {
       Xrm.Page.data.entity.attributes.get("ccx_duration").setValue(0);
       Xrm.Page.data.entity.attributes.get("ccx_duration").setSubmitMode("always");
       }
    }
else
   {
   Xrm.Page.ui.tabs.get("General").sections.get("Review").setVisible(true);
   Xrm.Page.ui.tabs.get("General").sections.get("Future").setVisible(true);
   Xrm.Page.ui.tabs.get("General").sections.get("Summary").setVisible(true);
   Xrm.Page.ui.controls.get("ccx_duration").setDisabled(false);
   Xrm.Page.data.entity.attributes.get("ccx_duration").setRequiredLevel("required");
   }

}