package kr.co.kfs.asseterp.oms.biz.org.mapper;

import kr.co.kfs.asseterp.oms.biz.org.dto.OrgHistoryRes;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrgHistoryMapper {
    /** 조직의 이력 (최근 변경일 순) */
    List<OrgHistoryRes> searchByCodeId(Long codeId);

    /** 이 조직을 상위로 둔 조직정보 수 */
    int countChildren(Long codeId);

    /** 이 조직에 발령된 사원 수 */
    int countEmployees(Long codeId);

    int deleteInfosByCode(Long codeId);

    int deleteInfo(Long infoId);
}
