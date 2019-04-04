function OnLoad()
{
Award('OnLoad');
}// End OnLoad

function Award(Trigger)
{
var AwardType = Xrm.Page.getAttribute("ccx_award_type").getValue();

    if (AwardType != 100)
    {
    Xrm.Page.getControl("ccx_award_type").removeOption(100); // 100 hours
    }
    if (AwardType != 200)
    {
    Xrm.Page.getControl("ccx_award_type").removeOption(200); // 200 hours
    }
    if (AwardType != 500)
    {
    Xrm.Page.getControl("ccx_award_type").removeOption(500); // 500 hours
    }
    if (AwardType == 1)
    {
    Xrm.Page.getControl("ccx_awarded_by_id").setDisabled(true);
    Xrm.Page.data.entity.attributes.get("ccx_awarded_by_id").setRequiredLevel("none");
    Xrm.Page.data.entity.attributes.get("ccx_description").setRequiredLevel("required");
    }
    else
    {
    Xrm.Page.getControl("ccx_awarded_by_id").setDisabled(false);
    Xrm.Page.data.entity.attributes.get("ccx_awarded_by_id").setRequiredLevel("required");
    Xrm.Page.data.entity.attributes.get("ccx_description").setRequiredLevel("none");
    }

}// End Award

function OnSave()
{
var AwardName = Xrm.Page.getAttribute("ccx_award_type").getText();

Xrm.Page.data.entity.attributes.get("ccx_name").setValue(AwardName);
Xrm.Page.data.entity.attributes.get("ccx_name").setSubmitMode("always");
}//  End OnSave



