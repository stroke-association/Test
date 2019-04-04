function activity()
{
var activity_id = Xrm.Page.data.entity.attributes.get("ccx_activity_id");
var training = Xrm.Page.data.entity.attributes.get("ccx_training");
var selected_id = activity_id.getValue();
var role = Math.floor(selected_id / 1000)

Xrm.Page.data.entity.attributes.get("ccx_role").setValue(role);
Xrm.Page.data.entity.attributes.get("ccx_role_code").setValue(role);

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
Xrm.Page.getAttribute("ccx_training").setSubmitMode("always");
}

function onload()
{
if (Xrm.Page.data.entity.attributes.get("ccx_role_code").getValue() == 3)
{
Xrm.Page.data.entity.attributes.get("ccx_reporting_category").setRequiredLevel("required");
}
}


