﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;

public partial class Advice_AdviceList : PageBase
{
    ECSMS.BLL.EC_Advice bll = new ECSMS.BLL.EC_Advice();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            BindCalendar();
        }
    }
    protected void BindCalendar()
    {
        try
        {    

            DataSet dsList = bll.GetList(" state=0 ");
            int count = dsList.Tables[0].Rows.Count;
            if (count > 0)
            {
                Pager(DataList1, AspNetPager1, dsList);
            }

        }
        catch (Exception ex)
        {

        }
    }

    protected void Pager(DataList dl, Wuqi.Webdiyer.AspNetPager anp, System.Data.DataSet dst)
    {
        try
        {
            PagedDataSource pds = new PagedDataSource();
            pds.DataSource = dst.Tables[0].DefaultView;
            pds.AllowPaging = true;

            anp.RecordCount = dst.Tables[0].DefaultView.Count;
            pds.CurrentPageIndex = anp.CurrentPageIndex - 1;
            pds.PageSize = anp.PageSize;

            dl.DataSource = pds;
            dl.DataBind();
        }
        catch (Exception ex)
        {

        }
    }

    protected void AspNetPager1_PageChanging(object src, Wuqi.Webdiyer.PageChangingEventArgs e)
    {
        try
        {
            AspNetPager1.CurrentPageIndex = e.NewPageIndex;
            BindCalendar();
        }
        catch (Exception ex)
        {

        }
    }

    protected void dlEdit(object sender, DataListCommandEventArgs e)
    {
        try
        {
            string strId = this.DataList1.DataKeys[e.Item.ItemIndex].ToString();
            Server.Transfer("AddAdvice.aspx?id=" + strId + " ", true);
        }
        catch (Exception ex)
        {

        }

    }

    protected void dlDel(object sender, DataListCommandEventArgs e)
    {
        try
        {
            string Id = this.DataList1.DataKeys[e.Item.ItemIndex].ToString();

            bll.Delete(int.Parse(Id));

            Maticsoft.Common.MessageBox.Show(this, "删除成功！");

            BindCalendar();
        }
        catch (Exception ex)
        {

        }
    }
}
