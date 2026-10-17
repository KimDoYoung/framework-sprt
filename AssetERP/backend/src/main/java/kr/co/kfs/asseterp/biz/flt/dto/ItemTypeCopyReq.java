package kr.co.kfs.asseterp.biz.flt.dto;

import java.util.List;

public record ItemTypeCopyReq(Long companyId, List<Long> itemTypeIds) {
}
