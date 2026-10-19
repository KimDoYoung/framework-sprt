package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EvalListRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp41_eval_list.xml + UpdateDataModel(emp41_eval_list) — 인사평가 항목 */
@Mapper
public interface EmpEvalListMapper {
    /** AS-IS emp41_eval_list.selectByEvalListStdId */
    List<EvalListRes> selectByEvalListStdId(@Param("evalListStdId") Long evalListStdId);

    /** AS-IS emp41_eval_list.selectByMaxCompanyId */
    List<EvalListRes> selectByMaxCompanyId(@Param("companyId") Long companyId);

    /** AS-IS emp41_eval_list.selectByMaxCompanyIdAdmin */
    List<EvalListRes> selectByMaxCompanyIdAdmin();

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** AS-IS emp41_eval_list.insert / UpdateDataModel INSERT */
    int insert(@Param("evalListId") Long evalListId, @Param("evalListStdId") Long evalListStdId, @Param("req") EvalListSaveReq.Row req);

    /** UpdateDataModel UPDATE (적용기준을 조건에 더했다) */
    int update(@Param("evalListStdId") Long evalListStdId, @Param("req") EvalListSaveReq.Row req);

    /** UpdateDataModel.deleteModel (ID로 DELETE, 적용기준을 조건에 더했다) */
    int deleteByIds(@Param("evalListStdId") Long evalListStdId, @Param("ids") List<Long> ids);

    /** AS-IS emp41_eval_list.deleteByEvalListStdId */
    int deleteByEvalListStdId(@Param("evalListStdId") Long evalListStdId);
}
