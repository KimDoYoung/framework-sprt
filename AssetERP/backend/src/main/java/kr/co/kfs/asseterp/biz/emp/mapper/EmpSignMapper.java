package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EmpSignRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpSignSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpSignMapper {

    List<EmpSignRes> selectByPersonId(@Param("personId") Long personId);

    EmpSignRes selectById(@Param("personId") Long personId, @Param("signId") Long signId);

    long selectNextId();

    /** emp60_sign.notSignIdList 대신 — 저장 요청에 없는 내 서명 중 사용 중인 건수 */
    int countUsedNotIn(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("signIds") List<Long> signIds);

    int insertSign(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("r") EmpSignSaveReq req);

    int updateSign(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("r") EmpSignSaveReq req);

    int deleteSign(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("signId") Long signId);

    /** apr04_appr_step.signIdListChk — 결재선에서 쓰인 건수 */
    int countApprStepBySignIds(@Param("companyId") Long companyId, @Param("signIds") List<Long> signIds);
}
