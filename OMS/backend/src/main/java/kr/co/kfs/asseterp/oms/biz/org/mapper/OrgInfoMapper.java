package kr.co.kfs.asseterp.oms.biz.org.mapper;

import kr.co.kfs.asseterp.oms.biz.org.dto.OrgInfoRes;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeRow;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgInfoRow;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgInfoSearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrgInfoMapper {
    List<OrgInfoRes> searchByKorName(OrgInfoSearchParam param);

    Long selectNextId();

    /** 조직코드 (AS-IS org01_code.insertOrg01Code) */
    int insertOrgCode(OrgCodeRow row);

    /** 조직정보 이력 (AS-IS org02_info.insertOrg02Info) */
    int insertOrgInfo(OrgInfoRow row);
}
