/* Javascript for combined Volunteer Activity Admin and Volunteer Glossary */
/* Activity Admin form should call these */
/* Glossary form should NOT since it is read-only */
function form_onload()
{
UpdateTrainingDropdown();
setreportinggroup();
}
function function_onsave()
{
if (Xrm.Page.getAttribute("ccx_groupactivitytype").getValue() != null)
  {   
  var name = Xrm.Page.getAttribute("ccx_groupactivitytype").getText();
  Xrm.Page.getAttribute("ccx_groupactivitytypeasstring").setValue(name);
 Xrm.Page.getAttribute("ccx_groupactivitytypeasstring").setSubmitMode("always");
  }
}

function UpdateTrainingDropdown()
{ 
  if ( Xrm.Page.getAttribute("ccx_groupactivitytype").getValue() != null)
  {
     if (Xrm.Page.getAttribute("ccx_groupactivitytype").getValue() == 8 && Xrm.Page.ui.getFormType() < 3)
     {
        Xrm.Page.getControl("ccx_grouptrainingtype").setDisabled(false);
      }
     else
    {
      Xrm.Page.getAttribute("ccx_grouptrainingtype").setValue(null);
      Xrm.Page.getControl("ccx_grouptrainingtype").setDisabled(true);
     }
  }
  else
  {
    Xrm.Page.getAttribute("ccx_grouptrainingtype").setValue(null);
    Xrm.Page.getControl("ccx_grouptrainingtype").setDisabled(true);
   } 
}
function setreportinggroup()
{
if (Xrm.Page.data.entity.attributes.get("ccx_role_code").getValue() == 3)
{
Xrm.Page.data.entity.attributes.get("ccx_volunteerreportinggroup").setRequiredLevel("required");
}
else
{
Xrm.Page.data.entity.attributes.get("ccx_volunteerreportinggroup").setRequiredLevel("none");
}
}

function activity_id_onchange()
//transferred from volunteer glossary form - 3 derived fields
{
var activity_id = Xrm.Page.data.entity.attributes.get("ccx_volunteeractivitycode");
var training = Xrm.Page.data.entity.attributes.get("ccx_training");
var selected_id = activity_id.getValue();
var role = Math.floor(selected_id / 1000)

Xrm.Page.data.entity.attributes.get("ccx_role").setValue(role);
Xrm.Page.data.entity.attributes.get("ccx_role_code").setValue(role);
var role_text=Xrm.Page.data.entity.attributes.get("ccx_role").getText();
//alert('Text='+role_text);
Xrm.Page.data.entity.attributes.get("ccx_role_text").setValue(role_text);

setreportinggroup();

if(selected_id % 1000 > 500)
{
training.setValue(1); 
}
else
{
training.setValue(0); 
}
Xrm.Page.getAttribute("ccx_role").setSubmitMode("always");
Xrm.Page.getAttribute("ccx_role_code").setSubmitMode("always");
Xrm.Page.getAttribute("ccx_role_text").setSubmitMode("always");
Xrm.Page.getAttribute("ccx_training").setSubmitMode("always");
}