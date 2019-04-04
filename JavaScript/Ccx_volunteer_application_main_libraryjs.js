function Form_onsave()
{
CreateForm=1;
EditForm=2;

if (crmForm.FormType==CreateForm || crmForm.FormType==EditForm)

{
CF=crmForm.all;

if (CF.ccx_volunteer_id.DataValue!= null) 

CF.ccx_name.DataValue = CF.ccx_volunteer_id.DataValue[0].name;

CF.ccx_name.ForceSubmit = true;

}
}
function Form_onload()
{
CreateForm=1;
EditForm=2;

if (crmForm.FormType==CreateForm || crmForm.FormType==EditForm)
{
CF=crmForm.all;
CF.ccx_rejected_reason.Disabled = true
CF.ccx_completed_date.Disabled = true
}
}
function statuscode_onchange()
{
CreateForm=1;
EditForm=2;

if (crmForm.FormType==CreateForm || crmForm.FormType==EditForm)
{
CF=crmForm.all;

if (CF.statuscode.DataValue==4)
{
CF.ccx_rejected_reason.Disabled = false
}

if (CF.statuscode.DataValue==3)
{
CF.ccx_completed_date.Disabled = false
}
}
}
