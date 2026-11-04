package kr.co.kfs.asseterp.biz.pln.mapper;

import kr.co.kfs.asseterp.biz.pln.dto.PlnResrchRes;
import kr.co.kfs.asseterp.biz.pln.dto.PlnResrchSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** 리서치 일정 (AS-IS server/pln/Pln03_Resrch) — EE90 Pln03_Lookup_ResrchDetail */
@Mapper
public interface PlnResrchMapper {

    /** AS-IS pln03_resrch.selectDetailInit — 새 건 초기값(새 번호·등록자·조사기간 오늘~7일·승인자 규칙 40의 승인자·종목) */
    PlnResrchRes selectDetailInit(@Param("empId") Long empId, @Param("orgId") Long orgId);

    /** AS-IS pln03_resrch.selectById */
    PlnResrchRes selectById(@Param("resrchId") Long resrchId);

    int countById(@Param("resrchId") Long resrchId);

    /** AS-IS pln03_resrch.insert (PostgreSQL 분기)의 UPDATE — 등록자 본인·승인 전 건만 */
    int update(@Param("regPersonId") Long regPersonId, @Param("req") PlnResrchSaveReq req);

    /** AS-IS pln03_resrch.insert의 INSERT — 등록자 = 로그인 사원, 등록일 = 오늘 */
    int insert(@Param("regPersonId") Long regPersonId, @Param("req") PlnResrchSaveReq req);

    /** AS-IS pln03_resrch.closeUpdate — closeYn 'true'/'false', closeDate 오늘 또는 null */
    int closeUpdate(@Param("resrchId") Long resrchId, @Param("regPersonId") Long regPersonId, @Param("close") boolean close);

    /** AS-IS pln03_resrch.apprUpdate — 확인자 본인이 승인(확인일 오늘) */
    int apprUpdate(@Param("resrchId") Long resrchId, @Param("cfrmPersonId") Long cfrmPersonId);
}
