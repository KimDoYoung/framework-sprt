package kr.co.kfs.asseterp.oms.biz.org.mapper;

import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeRes;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeRow;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeSearchParam;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgHistoryRes;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgInfoRow;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrgCodeMapper {
    Long selectNextId();

    /** 기준일 회사 조직 전체 (깊이 우선, 조직 장 포함) */
    List<OrgCodeRes> searchTree(OrgCodeSearchParam param);

    /** 기준일 조직 단건 */
    OrgCodeRes selectByBaseDate(OrgCodeSearchParam param);

    /** 조직코드의 회사 (권한 확인용) */
    Long selectCompanyId(Long codeId);

    OrgHistoryRes selectInfo(Long infoId);

    long countInfos(Long codeId);

    int insertCode(OrgCodeRow row);

    int updateCode(OrgCodeRow row);

    int deleteCode(Long codeId);

    int insertInfo(OrgInfoRow row);

    int updateInfo(OrgInfoRow row);
}
