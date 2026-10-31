package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무기술서 파일 작업중 표시 (tdm.Tdm31_RoleDesc.updateWorkDate: on = workStatus "99", off = "10") */
public record TdmWorkDateReq(boolean on) {
}
