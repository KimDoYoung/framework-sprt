package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.DutyReconRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmDutyReconMapper {

    /** AS-IS sys99_print.insertReconTdm — f_recon_tdm이 (windowClassName, groupId)의 sys99_print 행을 지우고 다시 채운다 */
    String insertReconTdm(@Param("windowClassName") String windowClassName, @Param("baseDate") String baseDate,
                          @Param("companyId") Long companyId, @Param("groupId") Long groupId);

    /** AS-IS sys99_print.selectByWindowClassName */
    List<DutyReconRes> selectByWindowClassName(@Param("windowClassName") String windowClassName, @Param("groupId") Long groupId);
}
